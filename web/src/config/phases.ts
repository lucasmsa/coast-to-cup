import type { StringKey } from './i18n'

export type Phase = 'all' | 'group' | 'R32' | 'R16' | 'QF' | 'SF' | '3RD' | 'F'

// Cumulative ladder: a phase counts every game up to and including that round.
const LADDER = ['group', 'R32', 'R16', 'QF', 'SF', 'F'] as const

// The two semifinal losers reach the third-place playoff, not the Final, so their
// counted games are the ladder up to the semis plus that one extra game.
const THIRD_PLACE_STAGES = ['group', 'R32', 'R16', 'QF', 'SF', '3RD']

/** Stages counted for a phase (cumulative). null = every game the team played. */
export function stagesFor(phase: Phase): Set<string> | null {
  if (phase === 'all') return null
  if (phase === '3RD') return new Set(THIRD_PLACE_STAGES)
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
  if (phase === '3RD') return THIRD_PLACE_STAGES.length + 2 // 3 group + R32/R16/QF/SF + third place = 8
  return 3 + LADDER.indexOf(phase as (typeof LADDER)[number]) // group=3, R32=4, ... F=8
}

export const PHASE_LABEL: Record<Phase, StringKey> = {
  all: 'phaseAll',
  group: 'groupStage',
  R32: 'stageR32',
  R16: 'stageR16',
  QF: 'stageQF',
  SF: 'stageSF',
  '3RD': 'stage3rd',
  F: 'stageF',
}

/**
 * Phase tabs to show, given which stages exist in the data (self-updating as
 * rounds resolve). Third-place and Final appear once those games are in the data;
 * each is a two-team pool, so the leaderboard shows them as a flat list.
 */
export function availablePhases(stagesInData: Set<string>): Phase[] {
  const tabs: Phase[] = ['all', 'group']
  for (const p of ['R32', 'R16', 'QF', 'SF', '3RD', 'F'] as Phase[]) {
    if (stagesInData.has(p)) tabs.push(p)
  }
  return tabs
}
