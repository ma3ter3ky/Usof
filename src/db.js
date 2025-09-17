import knex from 'knex'
import knexConfig from '../knexfile.js'

const env = process.env.NODE_ENV === 'test' ? 'test' : 'development'

export const db = knex(knexConfig[env])

export async function assertDbConnection() {
  await db.raw('SELECT 1')
}
