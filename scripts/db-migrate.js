import 'dotenv/config'
import knex from 'knex'
import knexConfig from '../knexfile.js'

const env = process.env.NODE_ENV === 'test' ? 'test' : 'development'
const db = knex(knexConfig[env])

try {
  await db.migrate.latest()
  console.log('✅ Migrations up to date')
} finally {
  await db.destroy()
}
