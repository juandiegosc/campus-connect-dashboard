import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useStudents } from '@/features/students/useStudents'
import { apiFetch, ApiError } from '@/shared/api/httpClient'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { AttendanceSegmented } from '@/shared/ui/SegmentedControl'
import { controlClass } from '@/shared/ui/styles'
import { useToast } from '@/shared/ui/useToast'
import { initials, today } from '@/shared/lib/format'
import type { AttendanceStatus, RecordAttendanceResponse, StudentReplica } from '@/types/api'

export function AttendancePage() {
  const { data: students, isLoading, isError, refetch } = useStudents()
  const { notify } = useToast()
  const [date, setDate] = useState(today)
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState('')
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({})

  const grades = useMemo(
    () => [...new Set((students ?? []).map((s) => s.grade))].sort(),
    [students],
  )

  const filtered = useMemo(
    () =>
      (students ?? []).filter(
        (s) =>
          s.fullName.toLowerCase().includes(search.toLowerCase().trim()) &&
          (grade === '' || s.grade === grade),
      ),
    [students, search, grade],
  )

  const save = useMutation({
    mutationFn: async () => {
      const entries = Object.entries(marks)
      // Un POST por estudiante marcado. allSettled = tolerante a fallos parciales (resiliencia).
      const results = await Promise.allSettled(
        entries.map(([studentId, status]) =>
          apiFetch<RecordAttendanceResponse>('/attendance/records', {
            method: 'POST',
            body: { studentId, date, status },
          }),
        ),
      )
      const failed = results.filter((r) => r.status === 'rejected').length
      return { total: entries.length, failed }
    },
    onSuccess: ({ total, failed }) => {
      if (failed === 0) {
        notify('success', `Asistencia guardada: ${total} registro(s).`)
        setMarks({})
      } else {
        notify('error', `${failed} de ${total} registros fallaron. Reintentá los pendientes.`)
      }
    },
    onError: (e) =>
      notify('error', e instanceof ApiError ? e.message : 'No se pudo guardar la asistencia.'),
  })

  if (isLoading) {
    return (
      <>
        <PageHeader title="Asistencia del día" />
        <Spinner label="Cargando estudiantes…" />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Asistencia del día" />
        <EmptyState
          icon="ti-alert-triangle"
          title="No se pudieron cargar los estudiantes"
          message="Revisá que el Gateway esté arriba."
          action={<Button onClick={() => refetch()}>Reintentar</Button>}
        />
      </>
    )
  }

  const markedCount = Object.keys(marks).length

  return (
    <>
      <PageHeader
        title="Asistencia del día"
        actions={
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${controlClass} w-auto`}
          />
        }
      />

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          placeholder="Buscar estudiante"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${controlClass} min-w-[180px] flex-1`}
        />
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className={`${controlClass} w-auto`}
        >
          <option value="">Grado: Todos</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="ti-users"
          title="No hay estudiantes para mostrar"
          message="La lista se llena cuando Secretaría matricula estudiantes (evento StudentEnrolled). Si recién arrancás, pediles que registren alumnos."
        />
      ) : (
        <Card>
          <div className="flex items-center gap-3 border-b border-line bg-panel px-4 py-2 text-xs text-muted">
            <span className="flex-1">Estudiante</span>
            <span className="w-20">Grado</span>
            <span className="w-[228px]">Estado</span>
          </div>
          {filtered.map((s) => (
            <AttendanceRow
              key={s.studentId}
              student={s}
              value={marks[s.studentId] ?? null}
              onChange={(v) => setMarks((m) => ({ ...m, [s.studentId]: v }))}
            />
          ))}
        </Card>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <i className="ti ti-route" aria-hidden="true" />
          Trazabilidad: X-Correlation-Id activo
        </span>
        <Button
          variant="primary"
          disabled={markedCount === 0 || save.isPending}
          onClick={() => save.mutate()}
        >
          <i className="ti ti-check" aria-hidden="true" />
          {save.isPending ? 'Guardando…' : `Guardar asistencia${markedCount ? ` (${markedCount})` : ''}`}
        </Button>
      </div>
    </>
  )
}

function AttendanceRow({
  student,
  value,
  onChange,
}: {
  student: StudentReplica
  value: AttendanceStatus | null
  onChange: (value: AttendanceStatus) => void
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
      <span className="flex flex-1 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-vino-soft text-xs font-medium text-vino">
          {initials(student.fullName)}
        </span>
        <span className="text-sm text-ink">{student.fullName}</span>
      </span>
      <span className="w-20">
        <Badge className="bg-panel text-muted">{student.grade}</Badge>
      </span>
      <span className="w-[228px]">
        <AttendanceSegmented value={value} onChange={onChange} name={student.fullName} />
      </span>
    </div>
  )
}
