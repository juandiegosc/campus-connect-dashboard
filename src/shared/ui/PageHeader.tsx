import type { ReactNode } from 'react'

// Encabezado de sección con la regla dorada — el elemento "firma" de la identidad UDLA.
// Reutilizable por los tres portales para mantener coherencia visual.
export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        <div className="mt-2 h-[3px] w-12 bg-oro" />
      </div>
      {actions}
    </div>
  )
}
