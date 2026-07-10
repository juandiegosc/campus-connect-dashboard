import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const numberFormat = new Intl.NumberFormat('es-EC')

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

// `new Date(iso)` en vez de `parseISO`: el backend serializa las fracciones de segundo con
// precisión variable (5 a 7 dígitos) y el parser nativo las acepta todas.
export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy, HH:mm:ss', { locale: es })
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm:ss', { locale: es })
}

/** Convierte la clave local `yyyy-mm-dd` de deriveEventStats a una etiqueta corta. */
export function formatDayKey(dayKey: string): string {
  const [year, month, day] = dayKey.split('-').map(Number)
  return format(new Date(year, month - 1, day), 'd MMM', { locale: es })
}

/** Retraso del bus, en la unidad que corresponda a su magnitud. */
export function formatLag(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(1)} s`
}
