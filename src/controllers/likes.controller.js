import { likesService } from '../services/likes.service.js'

export const likesController = {
  async upsert(req, res, next) {
    try {
      const result = await likesService.upsert(req.user, req.body)
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  },
  async remove(req, res, next) {
    try {
      const result = await likesService.remove(req.user, req.body)
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  }
}
