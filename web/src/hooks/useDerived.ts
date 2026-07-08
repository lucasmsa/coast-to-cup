import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { Derived } from '../types'

type Status = 'loading' | 'ready' | 'error'

/** Loads derived.json into the store once and reports load status. */
export function useDerived(): { data: Derived | null; status: Status } {
  const data = useStore((s) => s.data)
  const setData = useStore((s) => s.setData)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    let live = true
    fetch(`${import.meta.env.BASE_URL}data/derived.json`)
      .then((r) => r.json())
      .then((d: Derived) => {
        if (!live) return
        setData(d)
        setStatus('ready')
      })
      .catch(() => live && setStatus('error'))
    return () => {
      live = false
    }
  }, [setData])

  return { data, status }
}
