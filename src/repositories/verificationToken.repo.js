/* eslint-disable*/
import { db } from '../db.js'

export const verifyTokenRepo = {
  async create({ user_id, token, expires_at }) {
    return db('email_verification_tokens').insert({
      user_id,
      token,
      expires_at,
      created_at: db.fn.now()
    })
  },
  async deleteById(id) {
    return db('email_verification_tokens').where({ id }).del()
  },
  async deleteByUserId(user_id) {
    return db('email_verification_tokens').where({ user_id }).del()
  },
  async findByToken(token) {
    return db('email_verification_tokens').where({ token }).first()
  },
  async findLatestByUserId(user_id) {
    return db('email_verification_tokens').where({ user_id }).orderBy('created_at', 'desc').first()
  }
}
