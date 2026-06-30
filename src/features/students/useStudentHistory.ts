import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/shared/api/httpClient'
import type { StudentHistory } from '@/types/api'

export function useStudentHistory(studentId: string | null) {
  return useQuery({
    queryKey: ['student-history', studentId],
    queryFn: () => apiFetch<StudentHistory>(`/attendance/students/${studentId}/history`),
    enabled: studentId !== null,
  })
}
