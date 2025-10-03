export async function up(knex) {
  await knex.schema.createTable('posts', t => {
    t.bigIncrements('id').primary()
    t.bigInteger('author_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    t.string('title', 256).notNullable()
    t.text('content', 'longtext').notNullable()
    t.enu('status', ['active', 'inactive'], { useNative: true, enumName: 'post_status' })
      .notNullable()
      .defaultTo('inactive')
    t.boolean('is_locked').notNullable().defaultTo(false)
    t.dateTime('published_at').nullable()
    t.timestamps(true, true)
    t.index(['author_id'], 'idx_posts_author')
    t.index(['status'], 'idx_posts_status')
    t.index(['published_at'], 'idx_posts_published_at')
  })
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('posts')
}
