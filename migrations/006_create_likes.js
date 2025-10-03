export async function up(knex) {
  await knex.schema.createTable('likes', t => {
    t.bigIncrements('id').primary()
    t.bigInteger('author_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    t.bigInteger('post_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
    t.bigInteger('comment_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('comments')
      .onDelete('CASCADE')
    t.enu('value', ['like', 'dislike'], { useNative: true, enumName: 'like_value' })
      .notNullable()
      .defaultTo('like')
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now())

    t.unique(['author_id', 'post_id'], 'uq_like_author_post')
    t.unique(['author_id', 'comment_id'], 'uq_like_author_comment')

    t.check('((post_id IS NOT NULL) XOR (comment_id IS NOT NULL))', [], 'chk_like_target')
  })
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('likes')
}
