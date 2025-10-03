export function errorHandler(err, req, res, _next) {
  const status = Number(err.status || 500)
  const code = err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR')
  const payload = {
    error: {
      code,
      message: err.message || 'Internal Server Error'
    }
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.error.stack = err.stack
  }
  res.status(status).json(payload)
}
