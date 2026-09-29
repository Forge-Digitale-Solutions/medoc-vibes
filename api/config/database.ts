import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

/**
 * SQLite by default for local boot without Postgres.
 * Set DB_CONNECTION=pg (+ DATABASE_URL or DB_*) for Dokploy / infra Postgres.
 */
const connection = process.env.DB_CONNECTION || 'sqlite'

const dbConfig = defineConfig({
  connection,

  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      schemaGeneration: {
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },
    },

    pg: {
      client: 'pg',
      connection: process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : {
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT || 5432),
            user: process.env.DB_USER || 'medoc',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'medoc_vibes',
          },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig
