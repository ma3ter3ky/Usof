import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function createAvatars() {
  const avatarsDir = path.resolve(__dirname, '..', 'uploads', 'avatars')
  mkdirSync(avatarsDir, { recursive: true })

  const png1x1 = Buffer.from(
    '89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000A49444154789C6360000002000150A7F64A0000000049454E44AE426082',
    'hex'
  )

  for (const name of ['admin', 'alice', 'bob', 'carol', 'dave']) {
    writeFileSync(path.join(avatarsDir, `${name}.png`), png1x1)
  }

  return avatarsDir
}
