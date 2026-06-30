import type { ReactNode } from 'react'

// Encabezado de sección con la regla dorada — el elemento "firma" de la identidad UDLA.
// Reutilizable por los tres portales para mantener coherencia visual.
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-base text-muted">{subtitle}</p>}
        <div className="mt-3 h-[3px] w-14 rounded-full bg-oro" />
      </div>
      {actions}
    </div>
  )
}
