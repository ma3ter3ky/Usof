export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('posts').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  await knex('posts').insert([
    {
      id: 1,
      author_id: 2,
      title: 'How to structure Express app?',
      content: 'Looking for best practices for MVC in Express…',
      status: 'active',
      is_locked: 0,
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      author_id: 3,
      title: 'Knex vs raw SQL',
      content: 'When to use Knex query builder vs raw SQL…',
      status: 'active',
      is_locked: 0,
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      author_id: 2,
      title: 'MySQL foreign keys',
      content: 'How to properly set cascades…',
      status: 'inactive',
      is_locked: 0,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      author_id: 4,
      title: 'JWT basics',
      content: 'What is access vs refresh token…',
      status: 'active',
      is_locked: 0,
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      author_id: 5,
      title: 'Testing REST APIs',
      content: 'How to write supertest integration tests…',
      status: 'active',
      is_locked: 0,
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}
