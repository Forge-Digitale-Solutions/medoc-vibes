import db from '@adonisjs/lucid/services/db'

export const CHIP_SLUGS = [
  'tout',
  'restos-bars',
  'sorties',
  'culture',
  'vide-greniers',
  'marches-fetes',
  'surf-cote',
] as const

export type ChipSlug = (typeof CHIP_SLUGS)[number]

export type FeedOrigin = {
  lat: number
  lon: number
  commune: string | null
}

type FeedCursor = {
  p: 0 | 1
  d: number
  t: 'place' | 'event'
  id: string
}

export type FeedItemRow = {
  id: string
  entity_type: 'place' | 'event'
  name: string | null
  title: string | null
  chip_slug: string
  subtitle: string
  lat: number
  lon: number
  media: { url: string; license?: string | null; attribution?: string | null } | null
  badge: string
  opening_or_when: string | null
  booking_or_ticket_url: string | null
  partner_boost: boolean
  distance_km: number
}

const EMPTY_MESSAGES: Record<string, string> = {
  'vide-greniers': 'Aucun vide-grenier à proximité pour le moment.',
  'marches-fetes': 'Aucun marché ou fête à proximité pour le moment.',
  'restos-bars': 'Aucun resto ou bar à proximité pour le moment.',
  sorties: 'Aucune sortie à proximité pour le moment.',
  culture: 'Aucun lieu culturel à proximité pour le moment.',
  'surf-cote': 'Aucun spot côte / surf à proximité pour le moment.',
  tout: 'Aucun plan à proximité pour le moment.',
}

function encodeCursor(row: FeedItemRow): string {
  const payload: FeedCursor = {
    p: row.partner_boost ? 1 : 0,
    d: Number(row.distance_km),
    t: row.entity_type,
    id: row.id,
  }
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

function decodeCursor(raw: string | undefined): FeedCursor | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as FeedCursor
    if (
      (parsed.p !== 0 && parsed.p !== 1) ||
      typeof parsed.d !== 'number' ||
      (parsed.t !== 'place' && parsed.t !== 'event') ||
      typeof parsed.id !== 'string'
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export default class FeedAroundService {
  async resolveOrigin(input: {
    lat?: number
    lon?: number
    commune?: string
  }): Promise<FeedOrigin | { error: string }> {
    if (input.lat !== undefined && input.lon !== undefined) {
      if (input.lat < -90 || input.lat > 90 || input.lon < -180 || input.lon > 180) {
        return { error: 'lat/lon out of range' }
      }
      return {
        lat: input.lat,
        lon: input.lon,
        commune: input.commune ?? null,
      }
    }

    if (!input.commune?.trim()) {
      return { error: 'lat+lon or commune is required' }
    }

    const row = await db
      .from('communes')
      .whereRaw('lower(name) = lower(?)', [input.commune.trim()])
      .whereNotNull('lat')
      .whereNotNull('lon')
      .first()

    if (!row) {
      return { error: `commune not in Medoc allowlist or missing centroid: ${input.commune}` }
    }

    return {
      lat: Number(row.lat),
      lon: Number(row.lon),
      commune: String(row.name),
    }
  }

  async dataAsOf(): Promise<string | null> {
    const row = await db
      .from('sync_runs')
      .where('status', 'ok')
      .orderBy('finished_at', 'desc')
      .first()
    return row?.finished_at ? new Date(row.finished_at).toISOString() : null
  }

  async list(params: {
    origin: FeedOrigin
    chip: ChipSlug
    limit: number
    cursor?: string
    radiusKm?: number | null
  }): Promise<{
    items: FeedItemRow[]
    next_cursor: string | null
    empty: { chip: string; message: string; cta: string } | null
  }> {
    const cursor = decodeCursor(params.cursor)
    if (params.cursor && !cursor) {
      throw new Error('invalid_cursor')
    }

    const bindings: Record<string, unknown> = {
      lat: params.origin.lat,
      lon: params.origin.lon,
      chip: params.chip,
      limit: params.limit + 1,
    }

    let cursorClause = ''
    if (cursor) {
      cursorClause = `
        AND (
          (CASE WHEN partner_boost THEN 1 ELSE 0 END) < :cursor_p
          OR (
            (CASE WHEN partner_boost THEN 1 ELSE 0 END) = :cursor_p
            AND distance_km > :cursor_d
          )
          OR (
            (CASE WHEN partner_boost THEN 1 ELSE 0 END) = :cursor_p
            AND distance_km = :cursor_d
            AND (entity_type, id::text) > (:cursor_t, :cursor_id)
          )
        )
      `
      bindings.cursor_p = cursor.p
      bindings.cursor_d = cursor.d
      bindings.cursor_t = cursor.t
      bindings.cursor_id = cursor.id
    }

    let radiusClausePlaces = ''
    let radiusClauseEvents = ''
    if (params.radiusKm != null) {
      radiusClausePlaces = `AND ST_DWithin(p.geom, o.geom, :radius_m)`
      radiusClauseEvents = `AND ST_DWithin(e.geom, o.geom, :radius_m)`
      bindings.radius_m = params.radiusKm * 1000
    }

    const chipClausePlaces =
      params.chip === 'tout' ? '' : 'AND p.chip_slug = :chip'
    const chipClauseEvents =
      params.chip === 'tout' ? '' : 'AND e.chip_slug = :chip'

    const sql = `
      WITH origin AS (
        SELECT ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography AS geom
      ),
      feed AS (
        SELECT
          p.id,
          'place'::text AS entity_type,
          p.name,
          NULL::text AS title,
          p.chip_slug,
          TRIM(BOTH ' · ' FROM CONCAT_WS(' · ', NULLIF(p.kind, ''), NULLIF(p.commune, ''))) AS subtitle,
          p.lat,
          p.lon,
          CASE
            WHEN jsonb_typeof(p.media) = 'array' AND jsonb_array_length(p.media) > 0
              THEN p.media->0
            ELSE NULL
          END AS media,
          COALESCE(s.badge, 'autre') AS badge,
          CASE
            WHEN p.opening_hours IS NULL THEN NULL
            WHEN jsonb_typeof(p.opening_hours) = 'string' THEN trim(both '"' from p.opening_hours::text)
            ELSE p.opening_hours->>'label'
          END AS opening_or_when,
          p.booking_url AS booking_or_ticket_url,
          (p.partner_id IS NOT NULL) AS partner_boost,
          (ST_Distance(p.geom, o.geom) / 1000.0) AS distance_km
        FROM places p
        CROSS JOIN origin o
        LEFT JOIN sources s ON s.id = p.source_id
        WHERE p.is_active = true
          AND p.geom IS NOT NULL
          ${chipClausePlaces}
          ${radiusClausePlaces}

        UNION ALL

        SELECT
          e.id,
          'event'::text AS entity_type,
          NULL::text AS name,
          e.title,
          e.chip_slug,
          TRIM(BOTH ' · ' FROM CONCAT_WS(' · ', NULLIF(e.price_label, ''), NULLIF(e.commune, ''))) AS subtitle,
          e.lat,
          e.lon,
          CASE
            WHEN jsonb_typeof(e.media) = 'array' AND jsonb_array_length(e.media) > 0
              THEN e.media->0
            ELSE NULL
          END AS media,
          COALESCE(s.badge, 'autre') AS badge,
          CASE
            WHEN e.starts_at IS NULL THEN NULL
            ELSE to_char(e.starts_at AT TIME ZONE 'Europe/Paris', 'DD/MM HH24:MI')
          END AS opening_or_when,
          COALESCE(e.ticket_url, e.registration_url) AS booking_or_ticket_url,
          (e.partner_id IS NOT NULL) AS partner_boost,
          (ST_Distance(e.geom, o.geom) / 1000.0) AS distance_km
        FROM events e
        CROSS JOIN origin o
        LEFT JOIN sources s ON s.id = e.source_id
        WHERE e.is_active = true
          AND e.geom IS NOT NULL
          ${chipClauseEvents}
          ${radiusClauseEvents}
      )
      SELECT *
      FROM feed
      WHERE true
        ${cursorClause}
      ORDER BY partner_boost DESC, distance_km ASC, entity_type ASC, id ASC
      LIMIT :limit
    `

    const result = await db.rawQuery(sql, bindings)
    const rows = (result.rows as FeedItemRow[]).map((row) => ({
      ...row,
      lat: Number(row.lat),
      lon: Number(row.lon),
      distance_km: Number(row.distance_km),
      partner_boost: Boolean(row.partner_boost),
      media:
        row.media && typeof row.media === 'object'
          ? (row.media as FeedItemRow['media'])
          : null,
    }))

    const hasMore = rows.length > params.limit
    const page = hasMore ? rows.slice(0, params.limit) : rows
    const nextCursor = hasMore && page.length ? encodeCursor(page[page.length - 1]) : null

    const empty =
      page.length === 0
        ? {
            chip: params.chip,
            message: EMPTY_MESSAGES[params.chip] ?? EMPTY_MESSAGES.tout,
            cta: 'suggest_add',
          }
        : null

    return { items: page, next_cursor: nextCursor, empty }
  }

  async count(params: {
    origin: FeedOrigin
    chip: ChipSlug
    radiusKm?: number | null
  }): Promise<number> {
    const bindings: Record<string, unknown> = {
      lat: params.origin.lat,
      lon: params.origin.lon,
      chip: params.chip,
    }

    let radiusClausePlaces = ''
    let radiusClauseEvents = ''
    if (params.radiusKm != null) {
      radiusClausePlaces = `AND ST_DWithin(p.geom, o.geom, :radius_m)`
      radiusClauseEvents = `AND ST_DWithin(e.geom, o.geom, :radius_m)`
      bindings.radius_m = params.radiusKm * 1000
    }

    const chipClausePlaces =
      params.chip === 'tout' ? '' : 'AND p.chip_slug = :chip'
    const chipClauseEvents =
      params.chip === 'tout' ? '' : 'AND e.chip_slug = :chip'

    const sql = `
      WITH origin AS (
        SELECT ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography AS geom
      )
      SELECT (
        (SELECT COUNT(*)::int
         FROM places p CROSS JOIN origin o
         WHERE p.is_active = true AND p.geom IS NOT NULL
           ${chipClausePlaces} ${radiusClausePlaces})
        +
        (SELECT COUNT(*)::int
         FROM events e CROSS JOIN origin o
         WHERE e.is_active = true AND e.geom IS NOT NULL
           ${chipClauseEvents} ${radiusClauseEvents})
      ) AS count
    `

    const result = await db.rawQuery(sql, bindings)
    return Number(result.rows[0]?.count ?? 0)
  }
}
