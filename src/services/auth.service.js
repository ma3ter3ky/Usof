import Joi from 'joi'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { userRepo } from '../repositories/user.repo.js'
import { verifyTokenRepo } from '../repositories/verificationToken.repo.js'
import { resetTokenRepo } from '../repositories/passwordResetToken.repo.js'
import { badRequest, forbidden, unauthorized, notFoundErr } from '../utils/httpError.js'
import { sendVerificationEmail, sendResetEmail } from './mail.service.js'

const APP_URL = process.env.APP_URL || 'http://localhost:3000'

const registerSchema = Joi.object({
  login: Joi.string().alphanum().min(3).max(32).required(),
  full_name: Joi.string().min(1).max(128).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(128).required()
})

const loginSchema = Joi.object({
  login: Joi.string().min(3).max(255),
  email: Joi.string().email().max(255),
  password: Joi.string().min(8).max(128).required()
}).xor('login', 'email') // exactly one of login or email

const resetReqSchema = Joi.object({
  email: Joi.string().email().max(255).required()
})

function signTokens(user) {
  const payload = { sub: user.id, role: user.role, ver: user.refresh_token_version }
  const access = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TTL || '900s'
  })
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TTL || '7d'
  })
  return { access, refresh }
}

export const authService = {
  async register(input) {
    const { value, error } = registerSchema.validate(input)
    if (error) throw badRequest(error.message)

    const [byEmail, byLogin] = await Promise.all([
      userRepo.findByEmail(value.email),
      userRepo.findByLogin(value.login)
    ])
    if (byEmail) throw badRequest('Email already in use', 'EMAIL_TAKEN')
    if (byLogin) throw badRequest('Login already in use', 'LOGIN_TAKEN')

    const passwordHash = await bcrypt.hash(value.password, 10)
    const user = await userRepo.create({ ...value, password_hash: passwordHash })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    await verifyTokenRepo.create({ user_id: user.id, token, expires_at: expiresAt })

    const link = `${APP_URL}/api/auth/verify?token=${encodeURIComponent(token)}`
    const info = await sendVerificationEmail(user.email, link)

    return { userId: user.id, email: user.email, verify: { link, preview: info.preview } }
  },

  async verifyEmail(token) {
    if (!token) throw badRequest('Missing token', 'MISSING_TOKEN')
    const row = await verifyTokenRepo.findByToken(token)
    if (!row) throw notFoundErr('Verification token not found')
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await verifyTokenRepo.deleteById(row.id)
      throw badRequest('Verification token expired', 'TOKEN_EXPIRED')
    }
    await userRepo.markEmailVerified(row.user_id)
    await verifyTokenRepo.deleteById(row.id)
    return { ok: true }
  },

  async login(input) {
    const { value, error } = loginSchema.validate(input)
    if (error) throw badRequest(error.message)

    const user = value.email
      ? await userRepo.findByEmail(value.email)
      : await userRepo.findByLogin(value.login)

    if (!user) throw unauthorized('Invalid credentials', 'INVALID_CREDENTIALS')
    const match = await bcrypt.compare(value.password, user.password_hash)
    if (!match) throw unauthorized('Invalid credentials', 'INVALID_CREDENTIALS')
    if (!user.email_verified) throw forbidden('Email not verified', 'EMAIL_NOT_VERIFIED')

    const { access, refresh } = signTokens(user)
    return { userId: user.id, role: user.role, access, refresh } // temp; will move cookie to controller
  },

  async requestPasswordReset(input) {
    const { value, error } = resetReqSchema.validate(input)
    if (error) throw badRequest(error.message)

    const user = await userRepo.findByEmail(value.email)
    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // +24h
      await resetTokenRepo.create({ user_id: user.id, token, expires_at: expiresAt })
      const link = `${APP_URL}/api/auth/password-reset/confirm?token=${encodeURIComponent(token)}`
      await sendResetEmail(user.email, link)
    }
    return { ok: true }
  },

  async refresh(req) {
    const cookie = req.cookies?.refresh_token
    if (!cookie) throw unauthorized('Missing refresh cookie')

    const payload = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    const user = await userRepo.findById(payload.sub)
    if (!user) throw unauthorized('Invalid refresh')
    if (payload.ver !== user.refresh_token_version) {
      throw unauthorized('Refresh invalidated')
    }

    const p = { sub: user.id, role: user.role, ver: user.refresh_token_version }
    const access = jwt.sign(p, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TTL || '900s'
    })
    const refresh = jwt.sign(p, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TTL || '7d'
    })

    return { access, refresh }
  },

  async logout(req) {
    const auth = req.headers.authorization || ''
    let userId = null
    try {
      const [, token] = auth.split(' ')
      if (token) {
        const p = jwt.verify(token, process.env.JWT_SECRET)
        userId = p.sub
      }
    } catch {
      /* TEMP: ignore */
    }

    if (!userId) {
      const cookie = req.cookies?.refresh_token
      if (!cookie) return
      try {
        const p = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
        userId = p.sub
      } catch {
        return
      }
    }
    if (userId) await userRepo.incrementRefreshVersion(userId)
  },

  async confirmPasswordReset(token, newPassword) {
    if (!token) throw badRequest('Missing reset token')
    if (!newPassword || newPassword.length < 8) {
      throw badRequest('Password must be at least 8 chars')
    }

    const row = await resetTokenRepo.findByToken(token)
    if (!row) throw badRequest('Reset token invalid or used', 'TOKEN_INVALID')
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await resetTokenRepo.deleteById(row.id)
      throw badRequest('Reset token expired', 'TOKEN_EXPIRED')
    }

    const hash = await bcrypt.hash(newPassword, 10)
    await userRepo.updatePasswordHash(row.user_id, hash)
    await resetTokenRepo.deleteById(row.id)
    return { ok: true }
  }
}
