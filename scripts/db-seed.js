import 'dotenv/config'
import knex from 'knex'
import knexConfig from '../knexfile.js'

const env = process.env.NODE_ENV === 'test' ? 'test' : 'development'
const db = knex(knexConfig[env])

try {
  await db.seed.run()
  console.log('✅ Seeds executed')
} finally {
  await db.destroy()
}
