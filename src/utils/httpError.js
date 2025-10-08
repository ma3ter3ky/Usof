export function badRequest(message = 'Bad Request', code = 'BAD_REQUEST') {
  const err = new Error(message)
  err.status = 400
  err.code = code
  return err
}

export function unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
  const err = new Error(message)
  err.status = 401
  err.code = code
  return err
}

export function forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
  const err = new Error(message)
  err.status = 403
  err.code = code
  return err
}

export function notFoundErr(message = 'Not Found', code = 'NOT_FOUND') {
  const err = new Error(message)
  err.status = 404
  err.code = code
  return err
}

export function conflict(message = 'Conflict', code = 'CONFLICT') {
  const err = new Error(message)
  err.status = 409
  err.code = code
  return err
}

export function internalError(message = 'Internal Server Error', code = 'INTERNAL_SERVER_ERROR') {
  const err = new Error(message)
  err.status = 500
  err.code = code
  return err
}
