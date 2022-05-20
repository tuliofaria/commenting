import Knex from 'knex'
import Bookshelf from 'bookshelf'
import knexConfig from '../knexfile'

const environment = process.env.NODE_ENV || 'development'
const configuration = knexConfig[environment]

export const knex = Knex(configuration)
// @ts-ignore
const bookshelf = Bookshelf(knex)
export default bookshelf
