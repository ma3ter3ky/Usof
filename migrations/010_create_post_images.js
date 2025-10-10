export async function up(knex) {
  const exists = await knex.schema.hasTable('post_images')
  if (!exists) {
    await knex.schema.createTable('post_images', t => {
      t.increments('id').primary()
      t.integer('post_id').unsigned().notNullable()
      t.string('path', 512).notNullable()
      t.timestamp('created_at').defaultTo(knex.fn.now())

      t.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE')
      t.index(['post_id'])
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('post_images')
}
