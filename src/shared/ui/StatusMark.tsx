import { motion } from 'motion/react'

interface StatusMarkProps {
  label: string
  online: boolean
  /** Reinicia el pulso cuando llega una lectura nueva. */
  pulseKey?: number
  detail?: string
}

/**
 * Marca de estado de un servicio. El color nunca comunica solo: siempre va acompañado del
 * texto de detalle ("34 ms" / "sin respuesta"), legible con cualquier deficiencia de color.
 */
export function StatusMark({ label, online, pulseKey, detail }: StatusMarkProps) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.span
        key={pulseKey}
        initial={{ opacity: 0.35, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`h-2 w-2 shrink-0 rounded-full ${online ? 'bg-present' : 'bg-absent'}`}
        aria-hidden="true"
      />
      <div className="min-w-0 leading-tight">
        <p className="eyebrow truncate text-ink">{label}</p>
        <p className={`tabular text-sm ${online ? 'text-muted' : 'text-absent'}`}>
          {detail ?? (online ? 'en línea' : 'sin respuesta')}
        </p>
      </div>
    </div>
  )
}
