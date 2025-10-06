import jwt from 'jsonwebtoken'
import { userRepo } from '../repositories/user.repo.js'
import { unauthorized, forbidden } from '../utils/httpError.js'

export async function requireAuth(req, _res, next) {
  try {
    const auth = req.headers.authorization || ''
    const [, token] = auth.split(' ')
    if (!token) throw unauthorized('Missing bearer token')

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userRepo.findById(payload.sub)
    if (!user) throw unauthorized('Invalid token')
    if (payload.ver !== user.refresh_token_version) {
      throw unauthorized('Token version invalidated')
    }
    req.user = { id: user.id, role: user.role }
    next()
  } catch (e) {
    next(unauthorized(e.message))
  }
}

export function requireRole(role) {
  return (req, _res, next) => {
    if (!req.user) return next(unauthorized('No session'))
    if (req.user.role !== role) return next(forbidden('Insufficient role'))
    next()
  }
}
