import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  children: ReactNode
}

/** Full-screen page overlay: flat background, eased slide-up entrance and exit. */
export function OverlayPage({ open, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink overflow-y-auto scroll-thin"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
