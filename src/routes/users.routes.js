import { Router } from 'express'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const r = Router()

r.route('/')
  .get(requireAuth, (_req, res) => res.json({ message: 'List users - TBD' }))
  .post(requireAuth, requireRole('admin'), (_req, res) =>
    res.json({ message: 'Create user - TBD' })
  )
  .all(methodNotAllowed)

r.route('/:id')
  .get(requireAuth, (_req, res) => res.json({ message: 'Get user - TBD' }))
  .patch(requireAuth, (_req, res) => res.json({ message: 'Update user - TBD' }))
  .delete(requireAuth, requireRole('admin'), (_req, res) =>
    res.json({ message: 'Delete user - TBD' })
  )
  .all(methodNotAllowed)

r.route('/avatar')
  .patch(requireAuth, (_req, res) => res.json({ message: 'Update avatar - TBD' }))
  .all(methodNotAllowed)

export default r
