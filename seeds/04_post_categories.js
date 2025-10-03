export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('post_categories').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  await knex('post_categories').insert([
    { post_id: 1, category_id: 1 },
    { post_id: 1, category_id: 2 },
    { post_id: 2, category_id: 3 },
    { post_id: 3, category_id: 3 },
    { post_id: 4, category_id: 4 },
    { post_id: 5, category_id: 5 }
  ])
}
