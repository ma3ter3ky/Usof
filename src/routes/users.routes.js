import { Router } from 'express'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { usersController } from '../controllers/users.controller.js'

const r = Router()

r.route('/avatar')
  .patch(requireAuth, (_req, res) =>
    res.status(501).json({ message: 'Avatar upload handled in Hour 14' })
  )
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
