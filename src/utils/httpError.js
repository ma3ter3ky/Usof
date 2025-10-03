export class HttpError extends Error {
  constructor(status, message, code) {
    super(message)
    this.status = status
    this.code = code
  }
}
export const badRequest = (msg, code = 'BAD_REQUEST') => new HttpError(400, msg, code)
export const unauthorized = (msg = 'Unauthorized', code = 'UNAUTHORIZED') =>
  new HttpError(401, msg, code)
export const forbidden = (msg = 'Forbidden', code = 'FORBIDDEN') => new HttpError(403, msg, code)
export const notFoundErr = (msg = 'Not Found', code = 'NOT_FOUND') => new HttpError(404, msg, code)
