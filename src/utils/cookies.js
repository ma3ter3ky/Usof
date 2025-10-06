import { parseTtl } from './parseTtl.js'

export function refreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    path: '/api/auth',
    maxAge: parseTtl(process.env.JWT_REFRESH_TTL || '7d')
  }
}
