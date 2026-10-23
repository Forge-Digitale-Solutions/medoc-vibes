import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sync_runs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('source_id', 64).notNullable().references('id').inTable('sources')
      table.timestamp('started_at', { useTz: true }).notNullable()
      table.timestamp('finished_at', { useTz: true }).nullable()
      table.string('status', 32).notNullable().defaultTo('running')
      table.jsonb('stats').nullable()
      table.text('error_summary').nullable()
      table.jsonb('params').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.index(['source_id', 'status'])
      table.index(['finished_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
