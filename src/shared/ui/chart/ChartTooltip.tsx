import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export interface TooltipAnchor {
  /** Porcentaje horizontal dentro del contenedor (0–100). */
  x: number
  /** Píxeles desde el borde superior del contenedor. */
  y: number
}

interface ChartTooltipProps {
  anchor: TooltipAnchor | null
  children: ReactNode
}

/**
 * Capa de hover compartida por los gráficos. El contenedor padre debe ser `relative`.
 * El texto lleva tokens de texto, nunca el color de la serie.
 */
export function ChartTooltip({ anchor, children }: ChartTooltipProps) {
  return (
    <AnimatePresence>
      {anchor && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.12 }}
          style={{ left: `${anchor.x}%`, top: anchor.y }}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink shadow-pop"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
