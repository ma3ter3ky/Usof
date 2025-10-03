export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('comments').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  await knex('comments').insert([
    {
      id: 1,
      post_id: 1,
      author_id: 3,
      content: 'Use layered architecture.',
      status: 'active',
      is_locked: 0,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      post_id: 1,
      author_id: 5,
      content: 'Split services/repositories.',
      status: 'active',
      is_locked: 0,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      post_id: 2,
      author_id: 2,
      content: 'Knex for migrations is great.',
      status: 'active',
      is_locked: 0,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      post_id: 4,
      author_id: 2,
      content: 'JWT access+refresh pattern.',
      status: 'active',
      is_locked: 0,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      post_id: 5,
      author_id: 3,
      content: 'Cover happy paths first.',
      status: 'active',
      is_locked: 0,
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}
