import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Edge-fade state for a scroll container, via IntersectionObserver sentinels.
 * Put `rootRef` on the scroller, `topRef` as its first child and `bottomRef` as
 * its last. bottom = true means there's more below (a scroll cue); top = true
 * only once scrolled, so a header at rest never dims.
 *
 * Callback refs (not a mount effect) wire the observer the moment the nodes
 * mount. That matters because the scroller renders only after data loads, well
 * after this hook first runs — an empty-deps effect would fire while the refs
 * are still null and never re-run.
 */
export function useEdgeFades<
  R extends HTMLElement = HTMLElement,
  S extends HTMLElement = HTMLDivElement,
>() {
  const [top, setTop] = useState(false)
  const [bottom, setBottom] = useState(false)
  const rootEl = useRef<R | null>(null)
  const topEl = useRef<S | null>(null)
  const bottomEl = useRef<S | null>(null)
  const io = useRef<IntersectionObserver | null>(null)

  const wire = useCallback(() => {
    io.current?.disconnect()
    const root = rootEl.current
    const t = topEl.current
    const b = bottomEl.current
    if (!root || !t || !b) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === t) setTop(!e.isIntersecting)
          if (e.target === b) setBottom(!e.isIntersecting)
        }
      },
      { root, threshold: 0 },
    )
    obs.observe(t)
    obs.observe(b)
    io.current = obs
  }, [])

  const rootRef = useCallback(
    (node: R | null) => {
      rootEl.current = node
      wire()
    },
    [wire],
  )
  const topRef = useCallback(
    (node: S | null) => {
      topEl.current = node
      wire()
    },
    [wire],
  )
  const bottomRef = useCallback(
    (node: S | null) => {
      bottomEl.current = node
      wire()
    },
    [wire],
  )

  useEffect(() => () => io.current?.disconnect(), [])

  return { rootRef, topRef, bottomRef, top, bottom }
}
