import { useState } from 'react'
import { ChartTooltip } from '@/shared/ui/chart/ChartTooltip'
import type { TooltipAnchor } from '@/shared/ui/chart/ChartTooltip'

export interface Segment {
  label: string
  value: number
  /** Color del relleno. Debe venir de la paleta validada. */
  color: string
}

/**
 * Barra de proporción. Dos categorías se leen mejor en línea que en un donut: la comparación
 * es de longitud, no de ángulo. Etiquetas directas debajo — con dos series no hace falta leyenda.
 */
export function ProportionBar({ segments }: { segments: Segment[] }) {
  const [anchor, setAnchor] = useState<TooltipAnchor | null>(null)
  const [hovered, setHovered] = useState<Segment | null>(null)

  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const visible = segments.filter((s) => s.value > 0)

  const share = (value: number) => (total === 0 ? 0 : Math.round((value / total) * 100))

  return (
    <div className="relative">
      {total === 0 ? (
        <div className="h-3 rounded-[4px] border border-dashed border-line" />
      ) : (
        <div className="flex h-3 gap-[2px]">
          {visible.map((segment, index) => (
            <div
              key={segment.label}
              style={{ flexGrow: segment.value, background: segment.color }}
              className={`min-w-[4px] transition-opacity hover:opacity-85 ${
                index === 0 ? 'rounded-l-[4px]' : ''
              } ${index === visible.length - 1 ? 'rounded-r-[4px]' : ''}`}
              onMouseEnter={(e) => {
                const parent = e.currentTarget.parentElement!.getBoundingClientRect()
                const own = e.currentTarget.getBoundingClientRect()
                setHovered(segment)
                setAnchor({ x: ((own.left + own.width / 2 - parent.left) / parent.width) * 100, y: -6 })
              }}
              onMouseLeave={() => {
                setHovered(null)
                setAnchor(null)
              }}
            />
          ))}
        </div>
      )}

      <ChartTooltip anchor={anchor}>
        {hovered && (
          <span className="tabular">
            {hovered.label}: {hovered.value} · {share(hovered.value)}%
          </span>
        )}
      </ChartTooltip>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-baseline gap-2">
            <span
              style={{ background: segment.color }}
              className="h-2.5 w-2.5 shrink-0 translate-y-px rounded-[2px]"
              aria-hidden="true"
            />
            <span className="text-base text-ink">{segment.label}</span>
            <span className="tabular text-base text-ink">{segment.value}</span>
            <span className="tabular text-sm text-muted">{share(segment.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
