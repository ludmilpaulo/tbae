export function fmtDate(s?: string | null): string {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return String(s)
  return d.toLocaleString()
}

export function progressPercent(total: number, created: number, updated: number, skipped: number, errors: number): number {
  const done = created + updated + skipped + errors
  if (!total) return 0
  return Math.min(100, Math.round((done / total) * 100))
}
