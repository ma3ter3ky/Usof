import { authService } from '../services/auth.service.js'
import { refreshCookieOptions } from '../utils/cookies.js'

export const authController = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body)
      res.status(201).json(result)
    } catch (e) {
      next(e)
    }
  },
  verify: async (req, res, next) => {
    try {
      const result = await authService.verifyEmail(req.query.token)
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  },
  requestReset: async (req, res, next) => {
    try {
      const result = await authService.requestPasswordReset(req.body)
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body)
      res.cookie('refresh_token', result.refresh, refreshCookieOptions())
      res.status(200).json({ userId: result.userId, role: result.role, access: result.access })
    } catch (e) {
      next(e)
    }
  },

  refresh: async (req, res, next) => {
    try {
      const result = await authService.refresh(req) // pass req to read cookie
      res.cookie('refresh_token', result.refresh, refreshCookieOptions())
      res.status(200).json({ access: result.access })
    } catch (e) {
      next(e)
    }
  },

  logout: async (req, res, next) => {
    try {
      await authService.logout(req)
      res.clearCookie('refresh_token', { path: '/api/auth' })
      res.status(204).send()
    } catch (e) {
      next(e)
    }
  },

  confirmReset: async (req, res, next) => {
    try {
      const { token } = req.params
      const { password } = req.body
      await authService.confirmPasswordReset(token, password)
      res.status(200).json({ ok: true })
    } catch (e) {
      next(e)
    }
  }
}
