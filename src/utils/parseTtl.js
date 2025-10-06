export function parseTtl(ttl) {
  const m = String(ttl).match(/^(\d+)([smhd])$/i)
  if (!m) return 7 * 24 * 60 * 60 * 1000
  const n = Number(m[1])
  const u = m[2].toLowerCase()
  return n * (u === 's' ? 1000 : u === 'm' ? 60000 : u === 'h' ? 3600000 : 86400000)
}
