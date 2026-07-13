import { useMemo } from 'react'
import { useStore } from '../store'

export interface BracketHalves {
  resolved: boolean
  half: Record<string, 'left' | 'right'>
}

/**
 * Split the knockout teams into the two bracket halves. The bracket is a tree
 * whose only cross-half links are the Final and the 3rd-place playoff, so the
 * connected components of every other knockout match are exactly the two sides.
 * `resolved` is true only once that yields exactly two halves.
 */
export function useBracketHalves(): BracketHalves {
  const data = useStore((s) => s.data)
  return useMemo(() => {
    const valid = new Set((data?.teams ?? []).map((t) => t.id))
    const ko = (data?.matches ?? []).filter((m) => m.stage !== 'group')

    const parent: Record<string, string> = {}
    const find = (x: string): string => {
      let root = x
      while (parent[root] !== root) root = parent[root]
      return root
    }
    const add = (x: string) => {
      if (!(x in parent)) parent[x] = x
    }
    const union = (a: string, b: string) => {
      add(a)
      add(b)
      parent[find(a)] = find(b)
    }

    for (const m of ko) {
      const a = m.a.team_id
      const b = m.b.team_id
      if (!valid.has(a) || !valid.has(b)) continue
      add(a)
      add(b)
      if (m.stage !== 'F' && m.stage !== '3RD') union(a, b)
    }

    const comps = new Map<string, string[]>()
    for (const id of Object.keys(parent)) {
      const root = find(id)
      const members = comps.get(root) ?? []
      members.push(id)
      comps.set(root, members)
    }
    if (comps.size !== 2) return { resolved: false, half: {} }

    // Left = the half feeding the first semifinal (stable ordering).
    const sf = ko.filter((m) => m.stage === 'SF')
    const roots = [...comps.keys()]
    const leftRoot = sf.length ? find(sf[0].a.team_id) : roots[0]

    const half: Record<string, 'left' | 'right'> = {}
    for (const [root, members] of comps) {
      const side = root === leftRoot ? 'left' : 'right'
      for (const id of members) half[id] = side
    }
    return { resolved: true, half }
  }, [data])
}
