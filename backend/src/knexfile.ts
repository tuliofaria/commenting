import type { Knex } from 'knex'
import dotenv from 'dotenv'
dotenv.config()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'abc123',
      database: process.env.DB_NAME || 'commenting',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

module.exports = config
