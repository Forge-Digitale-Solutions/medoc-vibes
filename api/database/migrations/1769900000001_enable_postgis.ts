import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS postgis')
  }

  async down() {
    // Keep PostGIS installed; dropping the extension would drop dependent columns.
  }
}
