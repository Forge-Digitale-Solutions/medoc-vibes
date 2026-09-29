/**
 * Contrats partagés Médoc Vibes — types légers pour API / ops / apps.
 * Stub OpenAPI : voir ./openapi.stub.json
 */

export type PlaceCategory =
  | 'restaurant'
  | 'bar'
  | 'nightlife'
  | 'culture'
  | 'surf'
  | 'fishing'
  | 'leisure'
  | 'ev_charger'
  | 'event'

export type GeoPoint = {
  lat: number
  lng: number
}

export type PlaceSummary = {
  id: string
  name: string
  category: PlaceCategory
  location: GeoPoint
  distanceMeters?: number
}

export type EventSummary = {
  id: string
  title: string
  startsAt: string
  endsAt?: string
  placeId?: string
  location?: GeoPoint
}

export type HealthResponse = {
  ok: true
  service: 'medoc-vibes-api'
  version: string
}

export type ApiError = {
  ok: false
  code: string
  message: string
}
