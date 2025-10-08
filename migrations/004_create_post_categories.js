export async function up(knex) {
  const exists = await knex.schema.hasTable('post_categories')
  if (!exists) {
    await knex.schema.createTable('post_categories', table => {
      table.increments('id').primary()
      table.integer('post_id').unsigned().notNullable()
      table.integer('category_id').unsigned().notNullable()

      table.unique(['post_id', 'category_id'])

      table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE')
      table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE')
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('post_categories')
}
