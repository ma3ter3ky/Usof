export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('categories').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  await knex('categories').insert([
    {
      id: 1,
      title: 'javascript',
      description: 'JS language',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      title: 'node',
      description: 'Node.js runtime',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      title: 'mysql',
      description: 'MySQL database',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      title: 'security',
      description: 'Auth, JWT, etc.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      title: 'testing',
      description: 'Jest, supertest',
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}
