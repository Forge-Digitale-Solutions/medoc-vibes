import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** Approximate centroids for seed (WGS84). Saint-Laurent-Médoc = produit défaut géoloc refusée. */
const CENTROIDS: Record<string, { lat: number; lon: number }> = {
  '33424': { lat: 45.1502, lon: -0.8235 }, // Saint-Laurent-Médoc
  '33214': { lat: 44.9786, lon: -1.0786 }, // Lacanau
  '33203': { lat: 45.1861, lon: -1.0564 }, // Hourtin
  '33514': { lat: 45.5114, lon: -1.1247 }, // Soulac-sur-Mer
  '33314': { lat: 45.1992, lon: -0.7486 }, // Pauillac
  '33240': { lat: 45.3070, lon: -0.9370 }, // Lesparre-Médoc
  '33056': { lat: 44.9110, lon: -0.6360 }, // Blanquefort
  '33540': { lat: 45.3550, lon: -1.1420 }, // Vendays-Montalivet
}

type CommuneRow = {
  commune: string
  code_insee: string
  code_postal: string
  zone: string
}

export default class extends BaseSeeder {
  async run() {
    const now = new Date()

    await db.table('sources').insert([
      {
        id: 'seed',
        label: 'Seed local',
        license: 'internal',
        attribution_template: 'Médoc Vibes seed',
        badge: 'autre',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'datatourisme',
        label: 'DATAtourisme',
        license: 'Licence Ouverte 2.0',
        attribution_template: 'DATAtourisme',
        badge: 'ot',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'openagenda',
        label: 'OpenAgenda',
        license: 'ODbL',
        attribution_template: 'OpenAgenda',
        badge: 'agenda',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'partner_cms',
        label: 'Partenaire',
        license: null,
        attribution_template: null,
        badge: 'partenaire',
        created_at: now,
        updated_at: now,
      },
    ]).onConflict('id').ignore()

    const csvPath = join(__dirname, '../data/medoc-communes-insee-map.csv')
    const lines = readFileSync(csvPath, 'utf8').trim().split('\n').slice(1)
    const communes: CommuneRow[] = lines.map((line) => {
      const [commune, code_insee, code_postal, zone] = line.split(',')
      return { commune, code_insee, code_postal, zone }
    })

    for (const c of communes) {
      const centroid = CENTROIDS[c.code_insee]
      await db
        .table('communes')
        .insert({
          insee_code: c.code_insee,
          name: c.commune,
          postal_code: c.code_postal,
          zone: c.zone,
          lat: centroid?.lat ?? null,
          lon: centroid?.lon ?? null,
          created_at: now,
          updated_at: now,
        })
        .onConflict('insee_code')
        .merge({
          name: c.commune,
          postal_code: c.code_postal,
          zone: c.zone,
          lat: centroid?.lat ?? null,
          lon: centroid?.lon ?? null,
          updated_at: now,
        })
    }

    // Enrich missing centroids from geo.api.gouv.fr (best-effort, non-blocking for seed places).
    const missing = await db.from('communes').whereNull('lat').select('insee_code')
    for (const row of missing) {
      try {
        const res = await fetch(
          `https://geo.api.gouv.fr/communes/${row.insee_code}?fields=centre&format=json`
        )
        if (!res.ok) continue
        const json = (await res.json()) as { centre?: { coordinates?: [number, number] } }
        const coords = json.centre?.coordinates
        if (!coords || coords.length < 2) continue
        await db
          .from('communes')
          .where('insee_code', row.insee_code)
          .update({ lon: coords[0], lat: coords[1], updated_at: new Date() })
      } catch {
        // offline / rate-limit — leave null
      }
    }

    const partnerId = '11111111-1111-4111-8111-111111111111'
    await db
      .table('partners')
      .insert({
        id: partnerId,
        name: 'La Guinguette du Lac (seed)',
        slug: 'guinguette-du-lac',
        status: 'active',
        created_at: now,
        updated_at: now,
      })
      .onConflict('id')
      .ignore()

    const placeIds = {
      guinguette: '22222222-2222-4222-8222-222222222222',
      surf: '33333333-3333-4333-8333-333333333333',
      bar: '44444444-4444-4444-8444-444444444444',
      chateau: '55555555-5555-4555-8555-555555555555',
    }

    await db.from('events').whereILike('external_id', 'seed-%').delete()
    await db.from('places').whereILike('external_id', 'seed-%').delete()

    await db.table('places').insert([
      {
        id: placeIds.guinguette,
        source_id: 'partner_cms',
        external_id: 'seed-guinguette',
        partner_id: partnerId,
        name: 'La Guinguette du Lac',
        chip_slug: 'sorties',
        kind: 'venue',
        short_description: 'Guinguette au bord du lac (fixture seed).',
        description: 'Lieu partenaire fictif pour tester le boost feed.',
        lat: 45.1865,
        lon: -1.061,
        commune: 'Hourtin',
        insee_code: '33203',
        opening_hours: JSON.stringify({ label: 'Dès 18h' }),
        amenities: JSON.stringify(['terrasse']),
        media: JSON.stringify([]),
        booking_url: null,
        website_url: 'https://example.com/guinguette',
        phone: null,
        license: null,
        attribution: 'Partenaire seed',
        synced_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: placeIds.surf,
        source_id: 'datatourisme',
        external_id: 'seed-surf-school',
        partner_id: null,
        name: 'École de surf Lacanau Océan',
        chip_slug: 'surf-cote',
        kind: 'sport',
        short_description: 'Cours et location (fixture seed).',
        description: null,
        lat: 44.994,
        lon: -1.157,
        commune: 'Lacanau',
        insee_code: '33214',
        opening_hours: JSON.stringify({ label: '9h-18h' }),
        amenities: JSON.stringify([]),
        media: JSON.stringify([]),
        booking_url: 'https://example.com/surf',
        website_url: null,
        phone: null,
        license: 'Licence Ouverte 2.0',
        attribution: 'DATAtourisme seed',
        synced_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: placeIds.bar,
        source_id: 'datatourisme',
        external_id: 'seed-bar-paulliac',
        partner_id: null,
        name: 'Le Comptoir des Quais',
        chip_slug: 'restos-bars',
        kind: 'venue',
        short_description: "Bar à vins face à l'estuaire (fixture).",
        description: null,
        lat: 45.1998,
        lon: -0.7495,
        commune: 'Pauillac',
        insee_code: '33314',
        opening_hours: JSON.stringify({ label: 'Mar-Dim 18h-1h' }),
        amenities: JSON.stringify(['terrasse']),
        media: JSON.stringify([]),
        booking_url: null,
        website_url: null,
        phone: null,
        license: 'Licence Ouverte 2.0',
        attribution: 'DATAtourisme seed',
        synced_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: placeIds.chateau,
        source_id: 'datatourisme',
        external_id: 'seed-slm-domaine',
        partner_id: null,
        name: 'Domaine de la Lande',
        chip_slug: 'culture',
        kind: 'heritage',
        short_description: 'Visite et dégustation (fixture près de Saint-Laurent-Médoc).',
        description: null,
        lat: 45.148,
        lon: -0.81,
        commune: 'Saint-Laurent-Médoc',
        insee_code: '33424',
        opening_hours: null,
        amenities: JSON.stringify([]),
        media: JSON.stringify([]),
        booking_url: null,
        website_url: 'https://example.com/domaine',
        phone: null,
        license: 'Licence Ouverte 2.0',
        attribution: 'DATAtourisme seed',
        synced_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ])

    const starts = new Date()
    starts.setDate(starts.getDate() + 2)
    starts.setHours(18, 0, 0, 0)
    const ends = new Date(starts)
    ends.setHours(23, 0, 0, 0)

    await db.table('events').insert([
      {
        id: '66666666-6666-4666-8666-666666666666',
        source_id: 'openagenda',
        external_id: 'seed-marche-nocturne',
        partner_id: null,
        place_id: null,
        title: 'Marché nocturne',
        description: 'Fixture OpenAgenda appoint.',
        chip_slug: 'marches-fetes',
        genre_or_keywords: 'marché',
        price_label: 'gratuit',
        starts_at: starts,
        ends_at: ends,
        lat: 45.51,
        lon: -1.12,
        commune: 'Soulac-sur-Mer',
        insee_code: '33514',
        media: JSON.stringify([]),
        ticket_url: null,
        registration_url: null,
        website_url: null,
        license: 'ODbL',
        attribution: 'OpenAgenda seed',
        synced_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: '77777777-7777-4777-8777-777777777777',
        source_id: 'partner_cms',
        external_id: 'seed-concert-pibales',
        partner_id: partnerId,
        place_id: placeIds.guinguette,
        title: 'Les Pibales',
        description: 'Concert seed partenaire.',
        chip_slug: 'sorties',
        genre_or_keywords: 'Rock · Folk',
        price_label: '12 €',
        starts_at: starts,
        ends_at: ends,
        lat: 45.1865,
        lon: -1.061,
        commune: 'Hourtin',
        insee_code: '33203',
        media: JSON.stringify([]),
        ticket_url: 'https://example.com/billets/pibales',
        registration_url: null,
        website_url: null,
        license: null,
        attribution: 'Partenaire seed',
        synced_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ])

    await db.from('sync_runs').where('source_id', 'seed').delete()
    await db.table('sync_runs').insert({
      id: randomUUID(),
      source_id: 'seed',
      started_at: now,
      finished_at: now,
      status: 'ok',
      stats: JSON.stringify({ fetched: 6, upserted: 6, soft_deleted: 0, skipped: 0 }),
      error_summary: null,
      params: JSON.stringify({ note: 'local seed' }),
      created_at: now,
      updated_at: now,
    })
  }
}
