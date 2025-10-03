export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('likes').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  await knex('likes').insert([
    // post likes
    { id: 1, author_id: 2, post_id: 2, comment_id: null, value: 'like', created_at: new Date() },
    { id: 2, author_id: 3, post_id: 1, comment_id: null, value: 'like', created_at: new Date() },
    { id: 3, author_id: 4, post_id: 5, comment_id: null, value: 'dislike', created_at: new Date() },
    // comment likes
    { id: 4, author_id: 5, post_id: null, comment_id: 1, value: 'like', created_at: new Date() },
    { id: 5, author_id: 2, post_id: null, comment_id: 3, value: 'like', created_at: new Date() }
  ])
}
