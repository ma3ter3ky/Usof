import { categoriesService } from '../services/categories.service.js'

export const categoriesController = {
  async list(_req, res, next) {
    try {
      res.json(await categoriesService.list())
    } catch (e) {
      next(e)
    }
  },
  async get(req, res, next) {
    try {
      res.json(await categoriesService.get(req.params.id))
    } catch (e) {
      next(e)
    }
  },
  async create(req, res, next) {
    try {
      const row = await categoriesService.create(req.body)
      res.status(201).json(row)
    } catch (e) {
      next(e)
    }
  },
  async update(req, res, next) {
    try {
      const row = await categoriesService.update(req.params.id, req.body)
      res.json(row)
    } catch (e) {
      next(e)
    }
  },
  async remove(req, res, next) {
    try {
      await categoriesService.delete(req.params.id)
      res.status(204).send()
    } catch (e) {
      next(e)
    }
  }
}
