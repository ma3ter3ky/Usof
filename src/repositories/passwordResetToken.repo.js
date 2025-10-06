import { db } from '../db.js'

export const resetTokenRepo = {
  async create({ user_id, token, expires_at }) {
    const [id] = await db('password_reset_tokens').insert({ user_id, token, expires_at })
    return db('password_reset_tokens').where({ id }).first()
  },
  async findByToken(token) {
    return db('password_reset_tokens').where({ token }).first()
  },
  async deleteById(id) {
    return db('password_reset_tokens').where({ id }).del()
  }
}
