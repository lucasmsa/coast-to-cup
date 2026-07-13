import type { StringKey } from './i18n'

export type Phase = 'all' | 'group' | 'R32' | 'R16' | 'QF' | 'SF' | 'F'

// Cumulative ladder: a phase counts every game up to and including that round.
const LADDER = ['group', 'R32', 'R16', 'QF', 'SF', 'F'] as const

/** Stages counted for a phase (cumulative). null = every game the team played. */
export function stagesFor(phase: Phase): Set<string> | null {
  if (phase === 'all') return null
  const idx = LADDER.indexOf(phase as (typeof LADDER)[number])
  return new Set(LADDER.slice(0, idx + 1))
}

/** Did the team reach this phase? All / group => any team; knockouts => played that round. */
export function reachedPhase(loads: { stage: string }[], phase: Phase): boolean {
  if (phase === 'all' || phase === 'group') return true
  return loads.some((l) => l.stage === phase)
}

/** Games counted at a phase: 3 group + one per knockout round reached. null for "all". */
export function gamesAtPhase(phase: Phase): number | null {
  if (phase === 'all') return null
  return 3 + LADDER.indexOf(phase as (typeof LADDER)[number]) // group=3, R32=4, ... F=8
}

export const PHASE_LABEL: Record<Phase, StringKey> = {
  all: 'phaseAll',
  group: 'groupStage',
  R32: 'stageR32',
  R16: 'stageR16',
  QF: 'stageQF',
  SF: 'stageSF',
  F: 'stageF',
}

/** Phase tabs to show, given which stages exist in the data (self-updating as rounds resolve). */
export function availablePhases(stagesInData: Set<string>): Phase[] {
  const tabs: Phase[] = ['all', 'group']
  for (const p of ['R32', 'R16', 'QF', 'SF', 'F'] as Phase[]) {
    if (stagesInData.has(p)) tabs.push(p)
  }
  return tabs
}
