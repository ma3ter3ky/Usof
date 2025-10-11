export async function seed(knex) {
  await knex('comments').del()

  const [c1] = await knex('comments').insert({
    post_id: 1,
    author_id: 2,
    body: 'Top A',
    depth: 0,
    path: ''
  })
  const [c2] = await knex('comments').insert({
    post_id: 1,
    author_id: 3,
    body: 'Top B',
    depth: 0,
    path: ''
  })

  await knex('comments')
    .where({ id: c1 })
    .update({ path: String(c1).padStart(6, '0') })
  await knex('comments')
    .where({ id: c2 })
    .update({ path: String(c2).padStart(6, '0') })

  const [r1] = await knex('comments').insert({
    post_id: 1,
    parent_id: c1,
    author_id: 4,
    body: 'Reply to A',
    depth: 1,
    path: ''
  })
  await knex('comments')
    .where({ id: r1 })
    .update({ path: `${String(c1).padStart(6, '0')}.${String(r1).padStart(6, '0')}` })
}
