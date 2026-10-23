/**
 * Ingest jobs (DATAtourisme, OpenAgenda, IRVE, …) are out of scope for the
 * PostGIS feed scaffold slice.
 *
 * Planned later (see docs/data-model-sync.md):
 * - DATAtourisme primary POI/events sync (DATATOURISME_API_KEY)
 * - OpenAgenda appoint (bbox + allowlist communes; empty OK)
 * - IRVE PAN snapshot + GET /v1/irve/nearby
 * - Soft-delete + sync_runs bookkeeping
 *
 * The API read path must keep reading Postgres/PostGIS only (no live OD calls).
 */
export const INGEST_STATUS = 'todo' as const
