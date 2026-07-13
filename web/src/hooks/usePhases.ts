import { useMemo } from 'react'
import { availablePhases, type Phase } from '../config/phases'
import { useStore } from '../store'

/** Phase tabs to show, derived from which knockout rounds exist in the data. */
export function usePhases(): Phase[] {
  const data = useStore((s) => s.data)
  return useMemo(() => {
    const stages = new Set((data?.matches ?? []).map((m) => m.stage))
    return availablePhases(stages)
  }, [data])
}
