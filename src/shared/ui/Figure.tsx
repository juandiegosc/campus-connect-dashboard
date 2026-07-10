import type { ReactNode } from 'react'

type Tone = 'default' | 'alert'
type Size = 'lg' | 'md'

interface FigureProps {
  value: ReactNode
  label: string
  /** Aclaración bajo la etiqueta. Una frase, no un párrafo. */
  hint?: string
  tone?: Tone
  size?: Size
}

const valueTone: Record<Tone, string> = {
  default: 'text-ink',
  alert: 'text-absent',
}

const ruleTone: Record<Tone, string> = {
  default: 'bg-line',
  alert: 'bg-absent/40',
}

const valueSize: Record<Size, string> = {
  lg: 'text-[3.25rem]',
  md: 'text-[2.25rem]',
}

/**
 * La cifra del informe. Spectral, tabular, con una regla fina debajo y la etiqueta en
 * versalitas. Sin caja: en un informe impreso los números no viven en tarjetas.
 */
export function Figure({ value, label, hint, tone = 'default', size = 'lg' }: FigureProps) {
  return (
    <div>
      <p
        className={`tabular font-display leading-none ${valueSize[size]} ${valueTone[tone]}`}
      >
        {value}
      </p>
      <div className={`mt-3 h-px w-full ${ruleTone[tone]}`} />
      <p className="mt-2.5 text-base text-ink">{label}</p>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
    </div>
  )
}
