export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('password_reset_tokens').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  const now = new Date()
  const twentyFourHours = 24 * 60 * 60 * 1000
  const in24h = new Date(now.getTime() + twentyFourHours)

  await knex('password_reset_tokens').insert([
    { id: 1, user_id: 2, token: 'reset-alice', expires_at: in24h, created_at: now },
    { id: 2, user_id: 3, token: 'reset-bob', expires_at: in24h, created_at: now },
    { id: 3, user_id: 4, token: 'reset-carol', expires_at: in24h, created_at: now },
    { id: 4, user_id: 5, token: 'reset-dave', expires_at: in24h, created_at: now },
    { id: 5, user_id: 1, token: 'reset-admin', expires_at: in24h, created_at: now }
  ])
}
