import { authService } from '../services/auth.service.js'

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
  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body)
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
  }
}
