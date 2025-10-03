import knex from 'knex'
import knexConfig from '../knexfile.js'

const db = knex(knexConfig.test)

export async function migrateLatest() {
  await db.migrate.latest()
}

export async function rollbackAll() {
  await db.migrate.rollback(true)
}

export async function destroyDb() {
  await db.destroy()
}
