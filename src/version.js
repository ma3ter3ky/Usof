import { readFile } from 'node:fs/promises'

let version = process.env.npm_package_version
if (!version) {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf-8'))
  version = pkg.version
}

export { version }
