import { STRINGS, type StringKey } from '../config/i18n'
import { useStore } from '../store'

/** Returns a translator bound to the current locale. */
export function useT(): (key: StringKey) => string {
  const locale = useStore((s) => s.locale)
  return (key) => STRINGS[locale][key]
}
