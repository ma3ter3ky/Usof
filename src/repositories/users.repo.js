import { db } from '../db.js'

const MAX_LIMIT = 50
const ALLOWED_SORT = new Set(['created_at', 'rating'])

function clampLimit(limit) {
  const n = Number(limit || 10)
  return Math.min(Math.max(n, 1), MAX_LIMIT)
}

function parseSort(sort) {
  const [field = 'created_at', dir = 'desc'] = String(sort || '').split(':')
  const col = ALLOWED_SORT.has(field) ? field : 'created_at'
  const direction = dir?.toLowerCase() === 'asc' ? 'asc' : 'desc'
  return { col, direction }
}

export const usersRepo = {
  async list({ page = 1, limit = 10, sort = 'created_at:desc' } = {}) {
    const l = clampLimit(limit)
    const p = Math.max(Number(page || 1), 1)
    const { col, direction } = parseSort(sort)

    const base = db('users')
      .select(
        'id',
        'login',
        'full_name',
        'email',
        'email_verified',
        'profile_picture',
        'rating',
        'role',
        'created_at',
        'updated_at'
      )
      .orderBy(col, direction)
      .limit(l)
      .offset((p - 1) * l)

    const [rows, [{ cnt } = { cnt: 0 }]] = await Promise.all([
      base,
      db('users').count({ cnt: '*' })
    ])

    return { rows, page: p, limit: l, total: Number(cnt) }
  },

  async findById(id) {
    return db('users')
      .select(
        'id',
        'login',
        'full_name',
        'email',
        'email_verified',
        'profile_picture',
        'rating',
        'role',
        'created_at',
        'updated_at'
      )
      .where({ id })
      .first()
  },

  // admin-only create
  async create({
    login,
    fullName,
    email,
    passwordHash,
    role = 'user',
    emailVerified = false,
    profilePicture = null
  }) {
    const [id] = await db('users').insert({
      login,
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role,
      email_verified: emailVerified ? 1 : 0,
      profile_picture: profilePicture
    })
    return this.findById(id)
  },

  async updateSelf(userId, { fullName, profilePicture }) {
    await db('users')
      .where({ id: userId })
      .update({
        ...(fullName ? { full_name: fullName } : {}),
        ...(profilePicture !== undefined ? { profile_picture: profilePicture } : {}),
        updated_at: db.fn.now()
      })
    return this.findById(userId)
  },

  async updateAdmin(id, { fullName, role, emailVerified, rating }) {
    await db('users')
      .where({ id })
      .update({
        ...(fullName ? { full_name: fullName } : {}),
        ...(role ? { role } : {}),
        ...(emailVerified !== undefined ? { email_verified: emailVerified ? 1 : 0 } : {}),
        ...(rating !== undefined ? { rating } : {}),
        updated_at: db.fn.now()
      })
    return this.findById(id)
  },

  async deleteById(id) {
    return db('users').where({ id }).del()
  }
}
