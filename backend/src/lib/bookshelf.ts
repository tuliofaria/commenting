import Knex from 'knex'
import Bookshelf from 'bookshelf'

export const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'abc123',
    database: process.env.DB_NAME || 'commenting',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433
  }
})
// @ts-ignore
const bookshelf = Bookshelf(knex)
export default bookshelf
