export async function up(knex) {
  await knex.schema.createTable('users', t => {
    t.bigIncrements('id').primary()
    t.string('login', 64).notNullable().unique()
    t.string('password_hash', 255).notNullable()
    t.string('full_name', 128).notNullable()
    t.string('email', 255).notNullable().unique()
    t.boolean('email_verified').notNullable().defaultTo(false)
    t.string('profile_picture', 255).nullable()
    t.integer('rating').notNullable().defaultTo(0)
    t.enu('role', ['user', 'admin'], { useNative: true, enumName: 'user_role' })
      .notNullable()
      .defaultTo('user')
    t.timestamps(true, true)
  })
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('users')
}
