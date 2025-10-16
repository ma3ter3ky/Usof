import jwt from 'jsonwebtoken'
import { userRepo } from '../repositories/user.repo.js'
import { unauthorized, forbidden } from '../utils/httpError.js'

async function resolveUserFromAuthHeader(header) {
  const auth = header || ''
  const [, token] = auth.split(' ')
  if (!token) return null

  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const user = await userRepo.findById(payload.sub)
  if (!user) throw unauthorized('Invalid token')
  if (payload.ver !== user.refresh_token_version) {
    throw unauthorized('Token version invalidated')
  }

  return { id: user.id, role: user.role }
}

export async function requireAuth(req, _res, next) {
  try {
    const user = await resolveUserFromAuthHeader(req.headers.authorization)
    if (!user) throw unauthorized('Missing bearer token')
    req.user = user
    next()
  } catch (e) {
    next(unauthorized(e.message))
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const user = await resolveUserFromAuthHeader(req.headers.authorization)
    if (user) req.user = user
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
