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

r.post('/refresh', authController.refresh)
r.all('/refresh', methodNotAllowed)

r.post('/logout', authController.logout)
r.all('/logout', methodNotAllowed)

r.post('/password-reset', authController.requestReset)
// confirm by path param (as per hour 9 requirement)
r.post('/password-reset/:token', authController.confirmReset)
/* r.all('/password-reset*', methodNotAllowed) */

export default r
