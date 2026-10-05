import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'communes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('insee_code', 5).primary()
      table.string('name').notNullable()
      table.string('postal_code', 10).notNullable()
      table.string('zone').notNullable()
      table.double('lat').nullable()
      table.double('lon').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.unique(['name'])
      table.index(['postal_code'])
    })

    this.defer(async (db) => {
      await db.rawQuery(`
        ALTER TABLE communes
          ADD COLUMN IF NOT EXISTS geom geography(Point, 4326)
      `)
      await db.rawQuery(`
        CREATE INDEX IF NOT EXISTS communes_geom_gix ON communes USING GIST (geom)
      `)
      await db.rawQuery(`
        CREATE OR REPLACE FUNCTION communes_set_geom() RETURNS trigger AS $$
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
        DROP TRIGGER IF EXISTS communes_set_geom_trg ON communes;
        CREATE TRIGGER communes_set_geom_trg
          BEFORE INSERT OR UPDATE OF lat, lon ON communes
          FOR EACH ROW EXECUTE FUNCTION communes_set_geom()
      `)
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery('DROP TRIGGER IF EXISTS communes_set_geom_trg ON communes')
      await db.rawQuery('DROP FUNCTION IF EXISTS communes_set_geom()')
    })
    this.schema.dropTable(this.tableName)
  }
}
