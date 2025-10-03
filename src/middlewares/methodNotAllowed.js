export function methodNotAllowed(req, res) {
  res.status(405).json({
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: `Method ${req.method} not allowed on ${req.baseUrl || req.originalUrl}\n`
    }
  })
}
