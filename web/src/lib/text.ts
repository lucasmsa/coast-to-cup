/** Lowercased, diacritic-free form so "Tchequia" matches "Tchéquia". */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Whether a team matches a search query by any of its names or its code. */
export function matchesTeam(query: string, ...haystacks: string[]): boolean {
  const q = fold(query.trim())
  if (!q) return true
  return haystacks.some((h) => fold(h).includes(q))
}
