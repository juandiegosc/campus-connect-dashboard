import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/shared/api/httpClient'
import type { DashboardDto } from '@/types/api'

// Read model CQRS de Analytics: se reconstruye consumiendo los eventos de integración.
// Refrescamos cada 10 s para que la matrícula de un estudiante desde el portal de Secretaría
// se vea subir aquí sin recargar.
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiFetch<DashboardDto>('/analytics/dashboard'),
    refetchInterval: 10_000,
  })
}
