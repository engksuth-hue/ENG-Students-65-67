export function formatNumber(n: number): string {
  return new Intl.NumberFormat('th-TH').format(n)
}
export function safeLower(s: string): string {
  return (s ?? '').toLowerCase()
}
