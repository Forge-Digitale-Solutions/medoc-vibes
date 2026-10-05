import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

/**
 * Postgres + PostGIS by default for the geo feed.
 * Override with DB_CONNECTION=sqlite only for offline smoke without Docker.
 */
const connection = process.env.DB_CONNECTION || 'pg'

const dbConfig = defineConfig({
  connection,

  connections: {
    pg: {
      client: 'pg',
      connection: process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : {
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT || 55432),
            user: process.env.DB_USER || 'medoc',
            password: process.env.DB_PASSWORD || 'medoc',
            database: process.env.DB_DATABASE || 'medoc_vibes',
          },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      seeders: {
        paths: ['database/seeders'],
      },
      debug: app.inDev,
    },

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
  },
})

export default dbConfig
