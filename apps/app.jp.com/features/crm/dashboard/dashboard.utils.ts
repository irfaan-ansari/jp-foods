export function getDashboardCount(value: string | number | undefined) {
  const count = Number(value)
  return Number.isFinite(count) && count >= 0 ? count : 0
}
