export async function up(knex) {
  await knex.schema.createTable('comments', t => {
    t.increments('id').primary()
    t.integer('post_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
    t.bigInteger('author_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    t.text('body', 'longtext').notNullable()
    t.enu('status', ['active', 'inactive'], { useNative: true, enumName: 'comment_status' })
      .notNullable()
      .defaultTo('active')
    t.boolean('is_locked').notNullable().defaultTo(false)
    t.timestamps(true, true)
    t.index(['post_id'], 'idx_comments_post')
    t.index(['author_id'], 'idx_comments_author')
  })
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('comments')
}
