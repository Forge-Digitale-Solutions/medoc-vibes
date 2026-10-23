import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('source_id', 64).notNullable().references('id').inTable('sources')
      table.string('external_id').notNullable()
      table.uuid('partner_id').nullable().references('id').inTable('partners').onDelete('SET NULL')
      table.uuid('place_id').nullable().references('id').inTable('places').onDelete('SET NULL')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.string('chip_slug', 64).notNullable()
      table.string('genre_or_keywords').nullable()
      table.string('price_label').nullable()
      table.timestamp('starts_at', { useTz: true }).nullable()
      table.timestamp('ends_at', { useTz: true }).nullable()
      table.double('lat').notNullable()
      table.double('lon').notNullable()
      table.string('commune').nullable()
      table.string('insee_code', 5).nullable()
      table.jsonb('media').notNullable().defaultTo('[]')
      table.string('ticket_url').nullable()
      table.string('registration_url').nullable()
      table.string('website_url').nullable()
      table.string('license').nullable()
      table.text('attribution').nullable()
      table.timestamp('source_updated_at', { useTz: true }).nullable()
      table.timestamp('synced_at', { useTz: true }).nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.string('dedup_key').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.unique(['source_id', 'external_id'])
      table.index(['chip_slug'])
      table.index(['starts_at'])
      table.index(['is_active'])
      table.index(['partner_id'])
      table.index(['place_id'])
    })

    this.defer(async (db) => {
      await db.rawQuery(`
        ALTER TABLE events
          ADD COLUMN IF NOT EXISTS geom geography(Point, 4326)
      `)
      await db.rawQuery(`
        CREATE INDEX IF NOT EXISTS events_geom_gix ON events USING GIST (geom)
      `)
      await db.rawQuery(`
        CREATE OR REPLACE FUNCTION events_set_geom() RETURNS trigger AS $$
        BEGIN
          IF NEW.lat IS NOT NULL AND NEW.lon IS NOT NULL THEN
            NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lon, NEW.lat), 4326)::geography;
          ELSE
            NEW.geom := NULL;
          END IF;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
      `)
      await db.rawQuery(`
        DROP TRIGGER IF EXISTS events_set_geom_trg ON events;
        CREATE TRIGGER events_set_geom_trg
          BEFORE INSERT OR UPDATE OF lat, lon ON events
          FOR EACH ROW EXECUTE FUNCTION events_set_geom()
      `)
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery('DROP TRIGGER IF EXISTS events_set_geom_trg ON events')
      await db.rawQuery('DROP FUNCTION IF EXISTS events_set_geom()')
    })
    this.schema.dropTable(this.tableName)
  }
}
