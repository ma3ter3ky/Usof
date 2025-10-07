import { usersService } from '../services/users.service.js'
import { unauthorized } from '../utils/httpError.js'

export const usersController = {
  async list(req, res, next) {
    try {
      const data = await usersService.list(req.query)
      res.json(data)
    } catch (e) {
      next(e)
    }
  },

  async get(req, res, next) {
    try {
      const user = await usersService.getById(req.params.id)
      res.json(user)
    } catch (e) {
      next(e)
    }
  },

  async create(req, res, next) {
    try {
      const created = await usersService.createByAdmin(req.body)
      res.status(201).json(created)
    } catch (e) {
      next(e)
    }
  },

  async patch(req, res, next) {
    try {
      if (!req.user) throw unauthorized('No session')
      const isAdmin = req.user.role === 'admin'
      const userId = Number(req.params.id)

      const data = isAdmin
        ? await usersService.updateByAdmin(userId, req.body)
        : await usersService.updateSelf(req.user.id, userId, req.body)

      res.json(data)
    } catch (e) {
      next(e)
    }
  },

  async remove(req, res, next) {
    try {
      await usersService.deleteById(req.params.id)
      res.status(204).send()
    } catch (e) {
      next(e)
    }
  }
}
