import type { StringKey } from '../config/i18n'

type Translate = (key: StringKey) => string

const STAGE_KEYS: Record<string, StringKey> = {
  R32: 'stageR32',
  R16: 'stageR16',
  QF: 'stageQF',
  SF: 'stageSF',
  '3RD': 'stage3rd',
  F: 'stageF',
}

/** Localized name of a knockout round ("Oitavas", "R16", ...). */
export function stageName(stage: string, t: Translate): string {
  const key = STAGE_KEYS[stage]
  return key ? t(key) : stage
}

/** Trip label in the team card: "Match 2" for group games, the round name otherwise. */
export function tripLabel(stage: string, matchday: number, t: Translate): string {
  return stage === 'group' ? `${t('match')} ${matchday}` : stageName(stage, t)
}

/** Row label in the results table: "Group J · 3" for group games, the round name otherwise. */
export function resultLabel(stage: string, group: string, matchday: number, t: Translate): string {
  return stage === 'group' ? `${t('group')} ${group} · ${matchday}` : stageName(stage, t)
}
