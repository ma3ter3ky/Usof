import { Router } from 'express'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const r = Router()

r.route('/')
  .get((_req, res) => res.json({ message: 'List categories - TBD' })) // public
  .post(requireAuth, requireRole('admin'), (_req, res) =>
    res.json({ message: 'Create category - TBD' })
  )
  .all(methodNotAllowed)

r.route('/:id')
  .get((_req, res) => res.json({ message: 'Get category - TBD' })) // public
  .patch(requireAuth, requireRole('admin'), (_req, res) =>
    res.json({ message: 'Update category - TBD' })
  )
  .delete(requireAuth, requireRole('admin'), (_req, res) =>
    res.json({ message: 'Delete category - TBD' })
  )
  .all(methodNotAllowed)

export default r
