export async function up(knex) {
  await knex.schema.createTable('post_categories', t => {
    t.bigInteger('post_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
    t.bigInteger('category_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE')
    t.primary(['post_id', 'category_id'])
    t.index(['category_id'], 'idx_post_categories_category')
  })
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('post_categories')
}
