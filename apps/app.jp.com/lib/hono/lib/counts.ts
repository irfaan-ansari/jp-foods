type Row = {
  status: string | null
  value: string | number
}

export function getStatusCounts(rows: Row[]) {
  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    if (row.status) {
      acc[row.status] = Number(row.value)
    }

    return acc
  }, {})

  return {
    all: rows.reduce((sum, row) => sum + Number(row.value), 0),
    ...counts,
  }
}
