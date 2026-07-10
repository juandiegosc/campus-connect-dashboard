import type { EventLogDto } from '@/types/api'

// Ventana del sparkline. Los eventos reales abarcan días, no horas: agrupar por hora
// dibujaría un gráfico casi vacío.
export const WINDOW_DAYS = 14

export interface EventTypeCount {
  type: string
  count: number
}

export interface DayBucket {
  /** Clave local `yyyy-mm-dd`. */
  day: string
  count: number
}

export interface EventStats {
  /** Tipos de evento por frecuencia, descendente. */
  byType: EventTypeCount[]
  /** Últimos WINDOW_DAYS días, incluidos los días sin eventos. */
  perDay: DayBucket[]
  /** Mediana de (receivedAt − occurredAt): el retraso real del bus. */
  medianLagMs: number | null
  /** Eventos que traen correlationId. El backend lo omite en los eventos de negocio. */
  correlated: number
  total: number
}

function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Convierte la bitácora cruda de Analytics en lo que el informe necesita.
 *
 * `now` se inyecta para poder testear la ventana de días sin depender del reloj.
 */
export function deriveEventStats(events: EventLogDto[], now: Date = new Date()): EventStats {
  const counts = new Map<string, number>()
  const perDayCounts = new Map<string, number>()
  const lags: number[] = []
  let correlated = 0

  for (const event of events) {
    counts.set(event.eventType, (counts.get(event.eventType) ?? 0) + 1)

    if (event.correlationId) correlated += 1

    const occurred = new Date(event.occurredAt)
    const received = new Date(event.receivedAt)

    if (!Number.isNaN(occurred.getTime())) {
      const key = dayKey(occurred)
      perDayCounts.set(key, (perDayCounts.get(key) ?? 0) + 1)

      if (!Number.isNaN(received.getTime())) {
        lags.push(received.getTime() - occurred.getTime())
      }
    }
  }

  // Ventana continua terminada hoy: un día sin eventos es un dato, no un hueco.
  const perDay: DayBucket[] = []
  for (let offset = WINDOW_DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)
    const key = dayKey(date)
    perDay.push({ day: key, count: perDayCounts.get(key) ?? 0 })
  }

  const byType = [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type))

  return { byType, perDay, medianLagMs: median(lags), correlated, total: events.length }
}
