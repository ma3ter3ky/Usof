import { db } from '../src/db.js'

try {
  console.log('Rolling back all migrations...')
  await db.raw('SET FOREIGN_KEY_CHECKS = 0')
  await db.migrate.rollback(null, true)
  await db.raw('SET FOREIGN_KEY_CHECKS = 1')
  console.log('✅ Rolled back all migrations')
  process.exit(0)
} catch (err) {
  console.error('❌ Rollback failed:', err)
  process.exit(1)
}
