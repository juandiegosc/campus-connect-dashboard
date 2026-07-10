import { useQuery } from '@tanstack/react-query'

// Los seis servicios del ecosistema, en el orden en que fluyen los eventos.
export const SERVICES = [
  'identity',
  'academic',
  'payments',
  'attendance',
  'notifications',
  'analytics',
] as const

export type ServiceName = (typeof SERVICES)[number]

export interface ServiceHealth {
  name: ServiceName
  online: boolean
  latencyMs: number | null
}

// No parseamos el cuerpo: la documentación discrepa entre `Healthy` y `{"status":"ok"}`.
// `res.ok` es la única señal en la que ambas versiones coinciden.
async function ping(name: ServiceName): Promise<ServiceHealth> {
  const started = performance.now()
  try {
    const res = await fetch(`/api/${name}/health`)
    return { name, online: res.ok, latencyMs: Math.round(performance.now() - started) }
  } catch {
    return { name, online: false, latencyMs: null }
  }
}

/**
 * Disponibilidad de los servicios, vía las rutas /health públicas (sin Bearer).
 *
 * Es un eje distinto al `status` del DashboardDto: aquel solo mira `failedMessages` y diría
 * `ok` con Payments caído. El informe muestra los dos y los distingue.
 */
export function useEcosystemHealth() {
  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['ecosystem-health'],
    queryFn: () => Promise.all(SERVICES.map(ping)),
    refetchInterval: 15_000,
    staleTime: 10_000,
  })

  const services = data ?? []

  return {
    services,
    online: services.filter((s) => s.online).length,
    total: SERVICES.length,
    isLoading,
    dataUpdatedAt,
  }
}
