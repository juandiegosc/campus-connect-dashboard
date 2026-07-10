import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/shared/api/httpClient'
import type { EventLogDto } from '@/types/api'

/** El backend limita `take` a 1–500 (def. 100). */
export function useEvents(take = 100) {
  return useQuery({
    queryKey: ['events', take],
    queryFn: () => apiFetch<EventLogDto[]>(`/analytics/events?take=${take}`),
    refetchInterval: 15_000,
  })
}
