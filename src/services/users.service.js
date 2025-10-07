import Joi from 'joi'
import bcrypt from 'bcryptjs'
import { usersRepo } from '../repositories/users.repo.js'
import { badRequest, forbidden, notFoundErr } from '../utils/httpError.js'

const roleEnum = ['user', 'admin']

const createSchema = Joi.object({
  login: Joi.string().alphanum().min(3).max(32).required(),
  full_name: Joi.string().min(1).max(128).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string()
    .valid(...roleEnum)
    .default('user'),
  email_verified: Joi.boolean().default(false)
})

const updateSelfSchema = Joi.object({
  full_name: Joi.string().min(1).max(128),
  profile_picture: Joi.string().max(1024)
}).min(1)

const updateAdminSchema = Joi.object({
  full_name: Joi.string().min(1).max(128),
  role: Joi.string().valid(...roleEnum),
  email_verified: Joi.boolean(),
  rating: Joi.number().integer().min(0)
}).min(1)

function sanitize(user) {
  if (!user) return user
  const { password_hash, ...rest } = user
  return rest
}

export const usersService = {
  async list(query) {
    const { page, limit, sort } = query || {}
    const data = await usersRepo.list({ page, limit, sort })
    return { ...data, rows: data.rows.map(sanitize) }
  },

  async getById(id) {
    const user = await usersRepo.findById(id)
    if (!user) throw notFoundErr('User not found')
    return sanitize(user)
  },

  async createByAdmin(input) {
    const { value, error } = createSchema.validate(input)
    if (error) throw badRequest(error.message)

    const passwordHash = await bcrypt.hash(value.password, 10)
    const created = await usersRepo.create({
      login: value.login,
      fullName: value.full_name,
      email: value.email,
      passwordHash,
      role: value.role,
      emailVerified: value.email_verified
    })
    return sanitize(created)
  },

  async updateSelf(authUserId, idParam, input) {
    const id = Number(idParam)
    if (authUserId !== id) throw forbidden('Cannot update other user')

    const { value, error } = updateSelfSchema.validate(input)
    if (error) throw badRequest(error.message)

    for (const forbiddenKey of ['role', 'email', 'login', 'password', 'email_verified']) {
      if (Object.prototype.hasOwnProperty.call(input, forbiddenKey)) {
        throw forbidden(`Cannot change field: ${forbiddenKey}`)
      }
    }

    const updated = await usersRepo.updateSelf(id, {
      fullName: value.full_name,
      profilePicture: value.profile_picture
    })
    return sanitize(updated)
  },

  async updateByAdmin(idParam, input) {
    const id = Number(idParam)
    const { value, error } = updateAdminSchema.validate(input)
    if (error) throw badRequest(error.message)

    const updated = await usersRepo.updateAdmin(id, {
      fullName: value.full_name,
      role: value.role,
      emailVerified: value.email_verified,
      rating: value.rating
    })
    if (!updated) throw notFoundErr('User not found')
    return sanitize(updated)
  },

  async deleteById(idParam) {
    const id = Number(idParam)
    const deleted = await usersRepo.deleteById(id)
    if (!deleted) throw notFoundErr('User not found')
  }
}
