import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useStudents } from '@/features/students/useStudents'
import { useStudentHistory } from '@/features/students/useStudentHistory'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Spinner } from '@/shared/ui/Spinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { StatusPill, SeverityPill } from '@/shared/ui/pills'
import { controlClass } from '@/shared/ui/styles'
import type { StudentReplica } from '@/types/api'

export function StudentsPage() {
  const { data: students, isLoading, isError } = useStudents()
  const [selected, setSelected] = useState<StudentReplica | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      (students ?? []).filter((s) =>
        s.fullName.toLowerCase().includes(search.toLowerCase().trim()),
      ),
    [students, search],
  )

  if (isLoading) {
    return (
      <>
        <PageHeader title="Estudiantes" />
        <Spinner label="Cargando estudiantes…" />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Estudiantes" />
        <EmptyState
          icon="ti-alert-triangle"
          title="No se pudieron cargar los estudiantes"
          message="Revisá que el Gateway y el servicio de Attendance estén arriba."
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title="Estudiantes" />
      <input
        placeholder="Buscar estudiante"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${controlClass} mb-3 max-w-sm`}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="ti-users"
          title="No hay estudiantes"
          message="La lista se llena cuando Secretaría matricula estudiantes (evento StudentEnrolled)."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            {filtered.map((s) => (
              <button
                key={s.studentId}
                onClick={() => setSelected(s)}
                className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-panel ${
                  selected?.studentId === s.studentId ? 'bg-vino-soft/40' : ''
                }`}
              >
                <span className="flex-1 text-sm text-ink">{s.fullName}</span>
                <Badge className="bg-panel text-muted">{s.grade}</Badge>
              </button>
            ))}
          </Card>
          <HistoryPanel student={selected} />
        </div>
      )}
    </>
  )
}

function HistoryPanel({ student }: { student: StudentReplica | null }) {
  const { data, isLoading } = useStudentHistory(student?.studentId ?? null)

  if (!student) {
    return (
      <Card className="flex items-center justify-center p-6">
        <span className="text-sm text-muted">Elegí un estudiante para ver su historial.</span>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <h2 className="font-display text-lg text-ink">{student.fullName}</h2>
      <div className="mt-1 mb-4 h-[3px] w-10 bg-oro" />
      {isLoading ? (
        <Spinner label="Cargando historial…" />
      ) : (
        <>
          <Section title="Asistencia" empty="Sin registros de asistencia.">
            {(data?.attendance ?? []).map((a) => (
              <li
                key={a.recordId}
                className="flex items-center justify-between border-b border-line py-2 text-sm last:border-b-0"
              >
                <span className="text-muted">{a.date}</span>
                <StatusPill status={a.status} />
              </li>
            ))}
          </Section>
          <Section title="Incidentes" empty="Sin incidentes reportados.">
            {(data?.incidents ?? []).map((i) => (
              <li
                key={i.incidentId}
                className="flex items-center justify-between border-b border-line py-2 text-sm last:border-b-0"
              >
                <span className="text-ink">{i.type}</span>
                <SeverityPill severity={i.severity} />
              </li>
            ))}
          </Section>
        </>
      )}
    </Card>
  )
}

function Section({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const items = Array.isArray(children) ? children : [children]
  const isEmpty = items.flat().filter(Boolean).length === 0
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-1 text-xs font-medium tracking-wide text-muted">{title}</p>
      {isEmpty ? <p className="text-sm text-muted">{empty}</p> : <ul>{children}</ul>}
    </div>
  )
}
