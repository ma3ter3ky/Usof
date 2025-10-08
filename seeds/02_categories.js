export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('categories').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  await knex('categories').insert([
    {
      id: 1,
      name: 'javascript',
      slug: 'javasript',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      name: 'node',
      slug: 'node',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      name: 'mysql',
      slug: 'mysql',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      name: 'security',
      slug: 'security',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      name: 'testing',
      slug: 'testing',
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}
