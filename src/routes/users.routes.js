import { Router } from 'express'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { usersController } from '../controllers/users.controller.js'
import { formidableImage } from '../middlewares/formidableImage.js'

const r = Router()

r.route('/avatar')
  .patch(requireAuth, formidableImage(), usersController.uploadAvatar)
  .all(methodNotAllowed)

r.route('/:id')
  .get(requireAuth, usersController.get)
  .patch(requireAuth, usersController.patch)
  .delete(requireAuth, requireRole('admin'), usersController.remove)
  .all(methodNotAllowed)

r.route('/')
  .get(requireAuth, usersController.list)
  .post(requireAuth, requireRole('admin'), usersController.create)
  .all(methodNotAllowed)

export default r
