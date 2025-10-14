export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('likes').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  const now = new Date()

  await knex('likes').insert([
    {
      id: 1,
      author_id: 2,
      target_type: 'post',
      target_id: 2,
      value: 1,
      created_at: now,
      updated_at: now
    },
    {
      id: 2,
      author_id: 3,
      target_type: 'post',
      target_id: 1,
      value: 1,
      created_at: now,
      updated_at: now
    },
    {
      id: 3,
      author_id: 4,
      target_type: 'post',
      target_id: 5,
      value: -1, // dislike
      created_at: now,
      updated_at: now
    },

    {
      id: 4,
      author_id: 5,
      target_type: 'comment',
      target_id: 1,
      value: 1,
      created_at: now,
      updated_at: now
    },
    {
      id: 5,
      author_id: 2,
      target_type: 'comment',
      target_id: 3,
      value: 1,
      created_at: now,
      updated_at: now
    }
  ])
}
