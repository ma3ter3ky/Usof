export async function up(knex) {
  await knex.schema.createTable('password_reset_tokens', t => {
    t.bigIncrements('id').primary()
    t.bigInteger('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    t.string('token', 255).notNullable().unique()
    t.dateTime('expires_at').notNullable()
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    t.index(['user_id'], 'idx_prt_user')
    t.index(['expires_at'], 'idx_prt_expires')
  })
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('password_reset_tokens')
}
