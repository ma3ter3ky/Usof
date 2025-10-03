export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('email_verification_tokens').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  const now = new Date()
  const threeDays = 3 * 24 * 60 * 60 * 1000
  const in3d = new Date(now.getTime() + threeDays)

  await knex('email_verification_tokens').insert([
    { id: 1, user_id: 4, token: 'verify-carol', expires_at: in3d, created_at: now },
    { id: 2, user_id: 5, token: 'verify-dave', expires_at: in3d, created_at: now },
    { id: 3, user_id: 2, token: 'verify-alice', expires_at: in3d, created_at: now },
    { id: 4, user_id: 3, token: 'verify-bob', expires_at: in3d, created_at: now },
    { id: 5, user_id: 1, token: 'verify-admin', expires_at: in3d, created_at: now }
  ])
}
