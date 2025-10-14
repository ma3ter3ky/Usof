import rateLimit from 'express-rate-limit'

const MIN = 60 * 1000
const TEN_MIN = MIN * 10

const AUTH_LIMIT_MIN = 5
const WRITE_LIMIT_TEN_MIN = 30

export const authLimiter = rateLimit({
  windowMs: MIN,
  max: AUTH_LIMIT_MIN,
  message: {
    error: { code: 'TOO_MANY_REQUESTS', message: 'Too many login attempts. Try again later.' }
  },
  standardHeaders: true,
  legacyHeaders: false
})

export const writeLimiter = rateLimit({
  windowMs: TEN_MIN,
  max: WRITE_LIMIT_TEN_MIN,
  message: {
    error: { code: 'TOO_MANY_ACTIONS', message: 'You are sending too many write requests.' }
  },
  standardHeaders: true,
  legacyHeaders: false
})
