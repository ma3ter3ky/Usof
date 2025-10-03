import 'dotenv/config'
import knex from 'knex'
import knexConfig from '../knexfile.js'

const env = process.env.NODE_ENV === 'test' ? 'test' : 'development'
const db = knex(knexConfig[env])

try {
  await db.migrate.rollback(undefined, true)
  console.log('✅ Rolled back all migrations')
} finally {
  await db.destroy()
}
