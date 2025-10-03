import bcrypt from 'bcryptjs'
import { createAvatars } from './scripts/users_avatar_generator.js'

const now = () => new Date()

export async function seed(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  await knex('users').del()
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1')

  const hash = s => bcrypt.hashSync(s, 10)

  createAvatars()
  await knex('users').insert([
    {
      id: 1,
      login: 'admin',
      password_hash: hash('admin123'),
      full_name: 'Site Admin',
      email: 'admin@example.com',
      email_verified: 1,
      profile_picture: 'uploads/avatars/admin.png',
      rating: 0,
      role: 'admin',
      created_at: now(),
      updated_at: now()
    },
    {
      id: 2,
      login: 'alice',
      password_hash: hash('alice123'),
      full_name: 'Alice Doe',
      email: 'alice@example.com',
      email_verified: 1,
      profile_picture: 'uploads/avatars/alice.png',
      rating: 0,
      role: 'user',
      created_at: now(),
      updated_at: now()
    },
    {
      id: 3,
      login: 'bob',
      password_hash: hash('bob123'),
      full_name: 'Bob Smith',
      email: 'bob@example.com',
      email_verified: 1,
      profile_picture: 'uploads/avatars/bob.png',
      rating: 0,
      role: 'user',
      created_at: now(),
      updated_at: now()
    },
    {
      id: 4,
      login: 'carol',
      password_hash: hash('carol123'),
      full_name: 'Carol Jones',
      email: 'carol@example.com',
      email_verified: 0,
      profile_picture: 'uploads/avatars/carol.png',
      rating: 0,
      role: 'user',
      created_at: now(),
      updated_at: now()
    },
    {
      id: 5,
      login: 'dave',
      password_hash: hash('dave123'),
      full_name: 'Dave Lee',
      email: 'dave@example.com',
      email_verified: 1,
      profile_picture: 'uploads/avatars/dave.png',
      rating: 0,
      role: 'user',
      created_at: now(),
      updated_at: now()
    }
  ])
}
