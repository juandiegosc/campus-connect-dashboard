import { useState } from 'react'
import { ChartTooltip } from '@/shared/ui/chart/ChartTooltip'
import type { TooltipAnchor } from '@/shared/ui/chart/ChartTooltip'

export interface BarItem {
  label: string
  value: number
}

/**
 * Barras horizontales de una sola serie. Sin leyenda: el título nombra la serie.
 *
 * Los tipos de evento se distinguen por longitud, no por color. Pintar siete hues sacados de
 * una paleta de dos sería el anti-patrón arcoíris, y el color no aportaría nada que la posición
 * no diga ya.
 */
export function BarList({ items }: { items: BarItem[] }) {
  const [anchor, setAnchor] = useState<TooltipAnchor | null>(null)
  const [hovered, setHovered] = useState<BarItem | null>(null)

  const max = Math.max(...items.map((i) => i.value), 1)
  const total = items.reduce((sum, i) => sum + i.value, 0)

  return (
    <div className="relative flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-4"
          onMouseEnter={(e) => {
            const own = e.currentTarget.getBoundingClientRect()
            const parent = e.currentTarget.parentElement!.getBoundingClientRect()
            setHovered(item)
            setAnchor({ x: 50, y: own.top - parent.top - 4 })
          }}
          onMouseLeave={() => {
            setHovered(null)
            setAnchor(null)
          }}
        >
          <span className="truncate text-base text-ink">{item.label}</span>
          <div className="h-2.5">
            <div
              style={{
                width: `${(item.value / max) * 100}%`,
                background: 'var(--color-azul-chart)',
              }}
              className="h-full min-w-[3px] rounded-r-[4px] transition-[width] duration-500 ease-out"
            />
          </div>
          <span className="tabular w-12 text-right text-base text-ink">{item.value}</span>
        </div>
      ))}

      <ChartTooltip anchor={anchor}>
        {hovered && (
          <span className="tabular">
            {hovered.label}: {hovered.value} de {total} ·{' '}
            {total === 0 ? 0 : Math.round((hovered.value / total) * 100)}%
          </span>
        )}
      </ChartTooltip>
    </div>
  )
}
