import formidable from 'express-formidable'
import { MAX_UPLOAD_BYTES } from '../utils/upload.js'

export function formidableImage() {
  return formidable({
    multiples: false,
    maxFileSize: MAX_UPLOAD_BYTES,
    keepExtensions: false
  })
}
