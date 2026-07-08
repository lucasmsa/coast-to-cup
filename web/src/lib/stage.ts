// Compact labels for a match's stage.

/** Trip label in the team card: "Match 2" for group games, the round code otherwise. */
export function tripLabel(stage: string, matchday: number, matchWord: string): string {
  return stage === 'group' ? `${matchWord} ${matchday}` : stage
}

/** Row label in the results table: "A1" for group games, the round code otherwise. */
export function resultLabel(stage: string, group: string, matchday: number): string {
  return stage === 'group' ? `${group}${matchday}` : stage
}
