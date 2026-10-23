import type { HttpContext } from '@adonisjs/core/http'
import FeedAroundService, { CHIP_SLUGS, type ChipSlug } from '#services/feed_around_service'

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : Number.NaN
}

export default class FeedController {
  async around({ request, response }: HttpContext) {
    const lat = parseOptionalNumber(request.input('lat'))
    const lon = parseOptionalNumber(request.input('lon'))
    const commune = request.input('commune') as string | undefined
    const chipRaw = (request.input('chip') as string | undefined) ?? 'tout'
    const limitRaw = parseOptionalNumber(request.input('limit'))
    const radiusKm = parseOptionalNumber(request.input('radius_km'))
    const cursor = request.input('cursor') as string | undefined

    if (lat !== undefined && Number.isNaN(lat)) {
      return response.badRequest({ error: { code: 'bad_request', message: 'invalid lat' } })
    }
    if (lon !== undefined && Number.isNaN(lon)) {
      return response.badRequest({ error: { code: 'bad_request', message: 'invalid lon' } })
    }
    if (radiusKm !== undefined && (Number.isNaN(radiusKm) || radiusKm <= 0)) {
      return response.badRequest({
        error: { code: 'bad_request', message: 'radius_km must be > 0 when provided' },
      })
    }
    if (!CHIP_SLUGS.includes(chipRaw as ChipSlug)) {
      return response.badRequest({ error: { code: 'bad_request', message: 'unknown chip' } })
    }

    const limit = Math.min(Math.max(limitRaw && !Number.isNaN(limitRaw) ? limitRaw : 50, 1), 100)
    const service = new FeedAroundService()
    const origin = await service.resolveOrigin({ lat, lon, commune })
    if ('error' in origin) {
      return response.badRequest({ error: { code: 'bad_request', message: origin.error } })
    }

    try {
      const { items, next_cursor, empty } = await service.list({
        origin,
        chip: chipRaw as ChipSlug,
        limit,
        cursor,
        radiusKm: radiusKm ?? null,
      })
      const dataAsOf = await service.dataAsOf()

      return response.ok({
        data_as_of: dataAsOf,
        query: {
          lat: origin.lat,
          lon: origin.lon,
          radius_km: radiusKm ?? null,
          chip: chipRaw,
          commune: origin.commune,
        },
        items: items.map(({ distance_km, ...item }) => ({
          ...item,
          // Optional helper for local testing; not required by OpenAPI MVP.
          distance_km,
        })),
        next_cursor,
        empty,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid_cursor') {
        return response.badRequest({
          error: { code: 'bad_request', message: 'invalid cursor' },
        })
      }
      throw error
    }
  }

  async aroundCount({ request, response }: HttpContext) {
    const lat = parseOptionalNumber(request.input('lat'))
    const lon = parseOptionalNumber(request.input('lon'))
    const commune = request.input('commune') as string | undefined
    const chipRaw = (request.input('chip') as string | undefined) ?? 'tout'
    const radiusKm = parseOptionalNumber(request.input('radius_km'))

    if (lat !== undefined && Number.isNaN(lat)) {
      return response.badRequest({ error: { code: 'bad_request', message: 'invalid lat' } })
    }
    if (lon !== undefined && Number.isNaN(lon)) {
      return response.badRequest({ error: { code: 'bad_request', message: 'invalid lon' } })
    }
    if (radiusKm !== undefined && (Number.isNaN(radiusKm) || radiusKm <= 0)) {
      return response.badRequest({
        error: { code: 'bad_request', message: 'radius_km must be > 0 when provided' },
      })
    }
    if (!CHIP_SLUGS.includes(chipRaw as ChipSlug)) {
      return response.badRequest({ error: { code: 'bad_request', message: 'unknown chip' } })
    }

    const service = new FeedAroundService()
    const origin = await service.resolveOrigin({ lat, lon, commune })
    if ('error' in origin) {
      return response.badRequest({ error: { code: 'bad_request', message: origin.error } })
    }

    const count = await service.count({
      origin,
      chip: chipRaw as ChipSlug,
      radiusKm: radiusKm ?? null,
    })
    const dataAsOf = await service.dataAsOf()

    return response.ok({
      data_as_of: dataAsOf,
      count,
      radius_km: radiusKm ?? null,
      chip: chipRaw,
    })
  }
}
