let counter = 0

// Deterministic-ish id that is safe to call during render or in reducers,
// without pulling in the store.
export function newIdSync(prefix = 'id'): string {
  counter += 1
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${counter}-${rand}`
}
