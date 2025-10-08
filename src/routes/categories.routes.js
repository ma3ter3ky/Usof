import { Router } from 'express'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { categoriesController } from '../controllers/categories.controller.js'

const r = Router()

r.route('/')
  .get(categoriesController.list)
  .post(requireAuth, requireRole('admin'), categoriesController.create)
  .all(methodNotAllowed)

r.route('/:id')
  .get(categoriesController.get)
  .patch(requireAuth, requireRole('admin'), categoriesController.update)
  .delete(requireAuth, requireRole('admin'), categoriesController.remove)
  .all(methodNotAllowed)

export default r
