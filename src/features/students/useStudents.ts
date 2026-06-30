import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/shared/api/httpClient'
import type { StudentReplica } from '@/types/api'

// Réplica local de estudiantes (poblada por el evento StudentEnrolled desde Academic).
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => apiFetch<StudentReplica[]>('/attendance/students'),
  })
}
