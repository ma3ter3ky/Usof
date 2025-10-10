import crypto from 'node:crypto'
import path from 'node:path'
import { promises as fs } from 'node:fs'

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 // 2MB

export function detectImageExt(mime) {
  return ALLOWED_IMAGE_MIME[mime] || null
}

export function randomName(ext) {
  const id = crypto.randomBytes(16).toString('hex')
  const ts = Date.now()
  return `${id}-${ts}.${ext}`
}

export async function moveToUploads(tmpPath, targetDir, fileName) {
  const dest = path.join(targetDir, fileName)
  await fs.rename(tmpPath, dest)
  return dest
}

export function normalizeMime(m) {
  if (!m) return ''
  const mm = m.toLowerCase()
  if (mm === 'image/jpg') return 'image/jpeg'
  if (mm === 'image/x-png') return 'image/png'
  if (mm === 'image/x-webp') return 'image/webp'
  return mm
}

const ALLOWED_IMAGE_MIME = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp']
])
