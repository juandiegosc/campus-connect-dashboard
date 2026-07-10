import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/shared/api/httpClient'
import type { NotificationDto, SendNotificationRequest } from '@/types/api'

/**
 * `POST /notifications/send` devuelve 202 y encola el comando. El consumidor lo procesa después,
 * así que la lista se refresca sola: no hay forma de leer el resultado en la respuesta.
 */
export function useNotifications(take = 100) {
  return useQuery({
    queryKey: ['notifications', take],
    queryFn: () => apiFetch<NotificationDto[]>(`/notifications?take=${take}`),
    refetchInterval: 5_000,
  })
}

export function useSendNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: SendNotificationRequest) =>
      apiFetch<void>('/notifications/send', { method: 'POST', body }),
    onSuccess: () => {
      // El dashboard también cambia: un envío fallido sube failedMessages y degrada el estado.
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
