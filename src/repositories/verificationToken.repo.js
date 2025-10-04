import { db } from '../db.js'

export const verifyTokenRepo = {
  async create({ user_id, token, expires_at }) {
    const [id] = await db('email_verification_tokens').insert({ user_id, token, expires_at })
    return db('email_verification_tokens').where({ id }).first()
  },
  async findByToken(token) {
    return db('email_verification_tokens').where({ token }).first()
  },
  async deleteById(id) {
    return db('email_verification_tokens').where({ id }).del()
  }
}
