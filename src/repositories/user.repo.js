import { db } from '../db.js'

export const userRepo = {
  async findByEmail(email) {
    return db('users').where({ email }).first()
  },
  async findByLogin(login) {
    return db('users').where({ login }).first()
  },
  async findById(id) {
    return db('users').where({ id }).first()
  },
  async create({ login, full_name, email, password_hash }) {
    const [id] = await db('users').insert({
      login,
      full_name,
      email,
      password_hash,
      email_verified: 0,
      rating: 0,
      role: 'user'
    })
    return this.findById(id)
  },
  async markEmailVerified(userId) {
    await db('users').where({ id: userId }).update({ email_verified: 1, updated_at: db.fn.now() })
    return this.findById(userId)
  }
}
