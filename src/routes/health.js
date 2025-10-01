import { Router } from 'express'
import { version } from '../version.js'
import { assertDbConnection } from '../db.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    await assertDbConnection()
    res.status(200).json({ status: 'ok', version, db: 'up' })
  } catch (err) {
    next(err)
  }
})

router.all('/', methodNotAllowed)

export default router
