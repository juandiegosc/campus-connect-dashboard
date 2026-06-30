import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useStudents } from '@/features/students/useStudents'
import { apiFetch, ApiError } from '@/shared/api/httpClient'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { Spinner } from '@/shared/ui/Spinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { controlClass, textareaClass } from '@/shared/ui/styles'
import { useToast } from '@/shared/ui/useToast'
import type { ReportIncidentResponse } from '@/types/api'

// El studentId es un ULID de 26 chars: se ELIGE de la lista, nunca se tipea.
const schema = z.object({
  studentId: z.string().length(26, 'Elegí un estudiante de la lista.'),
  type: z.string().min(1, 'Indicá el tipo de incidente.'),
  severity: z.enum(['Low', 'Medium', 'High']),
  description: z.string().min(1, 'Describí el incidente.'),
})

type FormValues = z.infer<typeof schema>

const TYPE_SUGGESTIONS = ['Behavior', 'Health', 'Safety', 'Academic']

export function IncidentsPage() {
  const { data: students, isLoading, isError } = useStudents()
  const { notify } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { studentId: '', type: '', severity: 'Low', description: '' },
  })

  const submit = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch<ReportIncidentResponse>('/attendance/incidents', {
        method: 'POST',
        body: values,
      }),
    onSuccess: (res) => {
      notify('success', `Incidente registrado (severidad ${res.severity}).`)
      reset()
    },
    onError: (e) =>
      notify('error', e instanceof ApiError ? e.message : 'No se pudo registrar el incidente.'),
  })

  if (isLoading) {
    return (
      <>
        <PageHeader title="Reportar incidente / novedad" />
        <Spinner label="Cargando estudiantes…" />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Reportar incidente / novedad" />
        <EmptyState
          icon="ti-alert-triangle"
          title="No se pudieron cargar los estudiantes"
          message="Revisá que el Gateway esté arriba."
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title="Reportar incidente / novedad" />
      {!students || students.length === 0 ? (
        <EmptyState
          icon="ti-users"
          title="No hay estudiantes"
          message="Necesitás estudiantes matriculados (evento StudentEnrolled) para reportar un incidente."
        />
      ) : (
        <Card className="max-w-xl p-5">
          <form
            onSubmit={handleSubmit((values) => submit.mutate(values))}
            className="flex flex-col gap-4"
          >
            <Field label="Estudiante" error={errors.studentId?.message}>
              <select {...register('studentId')} className={controlClass}>
                <option value="">Seleccioná un estudiante</option>
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.fullName} — {s.grade}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tipo" error={errors.type?.message}>
              <input
                list="incident-types"
                {...register('type')}
                placeholder="Behavior, Health, Safety…"
                className={controlClass}
              />
              <datalist id="incident-types">
                {TYPE_SUGGESTIONS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>

            <Field label="Severidad" error={errors.severity?.message}>
              <select {...register('severity')} className={controlClass}>
                <option value="Low">Baja</option>
                <option value="Medium">Media</option>
                <option value="High">Alta</option>
              </select>
            </Field>

            <Field label="Descripción" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Detalle del incidente"
                className={textareaClass}
              />
            </Field>

            <Button type="submit" variant="primary" disabled={submit.isPending}>
              <i className="ti ti-flag" aria-hidden="true" />
              {submit.isPending ? 'Registrando…' : 'Reportar incidente'}
            </Button>
          </form>
        </Card>
      )}
    </>
  )
}
