import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'

const r = Router()

r.post('/register', authController.register)
r.all('/register', methodNotAllowed)

r.get('/verify', authController.verify)
r.all('/verify', methodNotAllowed)

r.post('/login', authController.login)
r.all('/login', methodNotAllowed)

r.post('/password-reset', authController.requestReset)
r.all('/password-reset', methodNotAllowed)

export default r
