import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  decimals?: number
  duration?: number
}

/** Eased count-up to a target value; re-animates from the previous value. */
export function CountUp({ value, decimals = 0, duration = 850 }: Props) {
  const [display, setDisplay] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const start = performance.now()
    const a = from.current
    const b = value
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(a + (b - a) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = b
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <span className="tabular">{display.toFixed(decimals)}</span>
}
