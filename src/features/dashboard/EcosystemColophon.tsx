import { StatusMark } from '@/shared/ui/StatusMark'
import type { ServiceHealth } from '@/shared/api/useHealth'
import { SERVICES } from '@/shared/api/useHealth'

interface EcosystemColophonProps {
  services: ServiceHealth[]
  isLoading: boolean
  dataUpdatedAt: number
}

/**
 * El colofón: los seis servicios en fila, cerrados por reglas doradas. Es el único elemento
 * de la página que se mueve — un pulso corto en cada lectura, cada 15 s.
 */
export function EcosystemColophon({ services, isLoading, dataUpdatedAt }: EcosystemColophonProps) {
  // Sin datos aún no afirmamos que estén caídos: un "sin respuesta" falso es peor que un guion.
  const rows = isLoading || services.length === 0 ? null : services

  return (
    <div className="border-y border-oro/40 py-5">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
        {rows
          ? rows.map((service) => (
              <StatusMark
                key={service.name}
                label={service.name}
                online={service.online}
                pulseKey={dataUpdatedAt}
                detail={service.online ? `${service.latencyMs} ms` : 'sin respuesta'}
              />
            ))
          : SERVICES.map((name) => (
              <div key={name} className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-line" aria-hidden="true" />
                <div className="leading-tight">
                  <p className="eyebrow text-ink">{name}</p>
                  <p className="text-sm text-muted">consultando…</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
