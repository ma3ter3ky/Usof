export async function up(knex) {
  const hasPostsRating = await knex.schema.hasColumn('posts', 'rating')
  if (!hasPostsRating) {
    await knex.schema.alterTable('posts', t => {
      t.integer('rating').notNullable().defaultTo(0)
    })
  }

  const hasCommentsRating = await knex.schema.hasColumn('comments', 'rating')
  if (!hasCommentsRating) {
    await knex.schema.alterTable('comments', t => {
      t.integer('rating').notNullable().defaultTo(0)
    })
  }

  const hasUsersRating = await knex.schema.hasColumn('users', 'rating')
  if (!hasUsersRating) {
    await knex.schema.alterTable('users', t => {
      t.integer('rating').notNullable().defaultTo(0)
    })
  }
}

export async function down(knex) {
  const hasUsersRating = await knex.schema.hasColumn('users', 'rating')
  if (hasUsersRating) {
    await knex.schema.alterTable('users', t => t.dropColumn('rating'))
  }

  const hasCommentsRating = await knex.schema.hasColumn('comments', 'rating')
  if (hasCommentsRating) {
    await knex.schema.alterTable('comments', t => t.dropColumn('rating'))
  }

  const hasPostsRating = await knex.schema.hasColumn('posts', 'rating')
  if (hasPostsRating) {
    await knex.schema.alterTable('posts', t => t.dropColumn('rating'))
  }
}
