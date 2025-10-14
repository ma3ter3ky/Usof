import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'

const r = Router()

r.route('/register').post(authController.register).all(methodNotAllowed)

r.route('/verify/resend').post(authController.resendVerify).all(methodNotAllowed)
r.route('/verify').get(authController.verify).all(methodNotAllowed)

r.route('/login').post(authController.login).all(methodNotAllowed)

r.route('/refresh').post(authController.refresh).all(methodNotAllowed)

r.route('/logout').post(authController.logout).all(methodNotAllowed)

r.route('/password-reset').post(authController.requestReset).all(methodNotAllowed)

r.route('/password-reset/:token').post(authController.confirmReset).all(methodNotAllowed)

export default r
