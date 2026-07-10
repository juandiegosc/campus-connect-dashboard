import { useState } from 'react'
import { ChartTooltip } from '@/shared/ui/chart/ChartTooltip'
import type { TooltipAnchor } from '@/shared/ui/chart/ChartTooltip'

export interface SparkPoint {
  key: string
  /** Texto ya formateado para el tooltip. El gráfico no sabe de fechas. */
  label: string
  value: number
}

const VIEW_W = 100
const VIEW_H = 32
const TOP = 2

/**
 * Área + línea de una sola serie. Sin marcador por punto y sin cifra sobre cada punto:
 * el detalle vive en el crosshair.
 *
 * `preserveAspectRatio="none"` estira el viewBox al ancho del contenedor sin medirlo en JS;
 * `vector-effect="non-scaling-stroke"` evita que eso deforme el grosor de la línea.
 */
export function Sparkline({ points, height = 120 }: { points: SparkPoint[]; height?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (points.length < 2) return null

  const max = Math.max(...points.map((p) => p.value), 1)
  const x = (index: number) => ((index + 0.5) / points.length) * VIEW_W
  const y = (value: number) => VIEW_H - (value / max) * (VIEW_H - TOP)

  const vertices = points.map((point, index) => `${x(index)},${y(point.value)}`)
  const line = `M ${vertices.join(' L ')}`
  // El área baja a la línea base en ambos extremos. Cada tramo lleva su `L` explícita:
  // apoyarse en el lineto implícito de la gramática SVG funciona, pero no se lee.
  const area = `M ${x(0)},${VIEW_H} L ${vertices.join(' L ')} L ${x(points.length - 1)},${VIEW_H} Z`

  const hovered = hoveredIndex === null ? null : points[hoveredIndex]
  const anchor: TooltipAnchor | null =
    hoveredIndex === null ? null : { x: x(hoveredIndex), y: (y(points[hoveredIndex].value) / VIEW_H) * height - 8 }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        style={{ height }}
        className="w-full"
        role="img"
        aria-label={`Eventos por día. Máximo ${max} en un día.`}
      >
        <path d={area} fill="var(--color-azul-chart)" opacity={0.12} />
        <path
          d={line}
          fill="none"
          stroke="var(--color-azul-chart)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {hoveredIndex !== null && (
          <line
            x1={x(hoveredIndex)}
            x2={x(hoveredIndex)}
            y1={0}
            y2={VIEW_H}
            stroke="var(--color-azul)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        )}
        <line
          x1={0}
          x2={VIEW_W}
          y1={VIEW_H}
          y2={VIEW_H}
          stroke="var(--color-line)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Zonas de hover en HTML: más anchas que la marca, sin matemática de coordenadas. */}
      <div className="absolute inset-0 flex" onMouseLeave={() => setHoveredIndex(null)}>
        {points.map((point, index) => (
          <div
            key={point.key}
            className="h-full flex-1"
            onMouseEnter={() => setHoveredIndex(index)}
          />
        ))}
      </div>

      <ChartTooltip anchor={anchor}>
        {hovered && (
          <span className="tabular">
            {hovered.label}: {hovered.value} {hovered.value === 1 ? 'evento' : 'eventos'}
          </span>
        )}
      </ChartTooltip>

      <div className="mt-2 flex justify-between text-sm text-muted">
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  )
}
