export function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-') // non-letters/digits → dash
    .replace(/^-+|-+$/g, '') // trim dashes
    .replace(/-{2,}/g, '-') // squash
}
