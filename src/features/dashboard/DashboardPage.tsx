import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '@/features/dashboard/useDashboard'
import { useEvents } from '@/features/events/useEvents'
import { deriveEventStats, WINDOW_DAYS } from '@/features/dashboard/deriveEventStats'
import { ecosystemVerdict } from '@/features/dashboard/verdict'
import { EcosystemColophon } from '@/features/dashboard/EcosystemColophon'
import { useEcosystemHealth } from '@/shared/api/useHealth'
import { SectionRule } from '@/shared/ui/SectionRule'
import { Figure } from '@/shared/ui/Figure'
import { Spinner } from '@/shared/ui/Spinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Reveal } from '@/shared/ui/Reveal'
import { ProportionBar } from '@/shared/ui/chart/ProportionBar'
import { BarList } from '@/shared/ui/chart/BarList'
import { Sparkline } from '@/shared/ui/chart/Sparkline'
import { formatDateTime, formatDayKey, formatLag, formatNumber } from '@/shared/lib/format'

// La bitácora tope del backend: 500. Cuantos más eventos, mejor la mediana de retraso.
const EVENT_SAMPLE = 500

export function DashboardPage() {
  const { data: dashboard, isLoading, isError } = useDashboard()
  const events = useEvents(EVENT_SAMPLE)
  const health = useEcosystemHealth()

  const stats = useMemo(() => deriveEventStats(events.data ?? []), [events.data])

  const sparkPoints = useMemo(
    () => stats.perDay.map((bucket) => ({ key: bucket.day, label: formatDayKey(bucket.day), value: bucket.count })),
    [stats.perDay],
  )

  if (isLoading) return <Spinner label="Consolidando indicadores…" />

  if (isError || !dashboard) {
    return (
      <EmptyState
        icon="ti-alert-triangle"
        title="No se pudo consolidar el informe"
        message="Analytics no respondió. Revisa que el Gateway y el servicio de Analytics estén arriba."
      />
    )
  }

  const verdict = ecosystemVerdict({
    status: dashboard.status,
    failedMessages: dashboard.failedMessages,
    servicesOnline: health.online,
    servicesTotal: health.total,
  })

  const hasFailures = dashboard.failedMessages > 0
  const traceability =
    stats.total === 0 ? 0 : Math.round((stats.correlated / stats.total) * 100)

  return (
    <div className="pb-12">
      <Reveal>
        <header className="pb-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="eyebrow">Informe de dirección</p>
            <p className="tabular text-sm text-muted">Corte {formatDateTime(dashboard.generatedAt)}</p>
          </div>
          <h1 className="mt-3 font-display text-[2.75rem] leading-[1.05] text-ink sm:text-[3.5rem]">
            Estado del ecosistema
          </h1>
          <div className="mt-5 h-[3px] w-16 rounded-full bg-oro" />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{verdict}</p>
        </header>

        <EcosystemColophon
          services={health.services}
          isLoading={health.isLoading}
          dataUpdatedAt={health.dataUpdatedAt}
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
          <section>
            <SectionRule eyebrow="Matrícula" />
            <Figure
              value={formatNumber(dashboard.totalStudents)}
              label="Estudiantes matriculados"
              hint="Proyección del evento StudentEnrolled"
            />
          </section>

          <section className="lg:border-l lg:border-oro/30 lg:pl-12">
            <SectionRule eyebrow="Finanzas" />
            <div className="grid grid-cols-2 gap-10">
              <Figure value={formatNumber(dashboard.paymentsConfirmed)} label="Pagos confirmados" />
              <Figure value={formatNumber(dashboard.paymentsPending)} label="Pagos pendientes" />
            </div>
            <div className="mt-9">
              <ProportionBar
                segments={[
                  { label: 'Confirmados', value: dashboard.paymentsConfirmed, color: 'var(--color-azul-chart)' },
                  { label: 'Pendientes', value: dashboard.paymentsPending, color: 'var(--color-oro)' },
                ]}
              />
            </div>
          </section>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-16">
          <SectionRule eyebrow="Operación" hint="Portal docente y bienestar" />
          <div className="grid grid-cols-2 gap-10 sm:max-w-xl">
            <Figure value={formatNumber(dashboard.attendanceRecorded)} label="Asistencias registradas" />
            <Figure value={formatNumber(dashboard.incidentsReported)} label="Incidentes reportados" />
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.15}>
        <section className="mt-16">
          <SectionRule eyebrow="Mensajería" hint="Bus de eventos · RabbitMQ" />

          <div className="grid grid-cols-2 gap-x-10 gap-y-10 lg:grid-cols-4">
            <Figure
              size="md"
              value={formatNumber(dashboard.eventsProcessed)}
              label="Eventos procesados"
              hint="Únicos, idempotentes"
            />
            <Figure
              size="md"
              value={formatNumber(dashboard.notificationsSent)}
              label="Notificaciones enviadas"
            />

            {hasFailures ? (
              <Link to="/notificaciones?estado=Failed" className="group block rounded-sm">
                <Figure
                  size="md"
                  tone="alert"
                  value={formatNumber(dashboard.failedMessages)}
                  label="Mensajes fallidos"
                  hint="Ver cuáles fallaron →"
                />
              </Link>
            ) : (
              <Figure size="md" value="0" label="Mensajes fallidos" hint="Sin fallos registrados" />
            )}

            <Figure
              size="md"
              value={formatLag(stats.medianLagMs)}
              label="Retraso mediano del bus"
              hint={`Mediana de ${formatNumber(stats.total)} eventos`}
            />
          </div>

          {events.isLoading ? (
            <div className="mt-12">
              <Spinner label="Leyendo la bitácora…" />
            </div>
          ) : stats.total === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon="ti-timeline-event"
                title="La bitácora está vacía"
                message="Analytics aún no ha ingerido ningún evento. Matricula un estudiante desde el portal de Secretaría para verla llenarse."
              />
            </div>
          ) : (
            <div className="mt-12 grid gap-14 lg:grid-cols-2">
              <div>
                <h3 className="eyebrow mb-5">Eventos por día · últimos {WINDOW_DAYS}</h3>
                <Sparkline points={sparkPoints} />
              </div>

              <div>
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h3 className="eyebrow">Eventos por tipo</h3>
                  <Link to="/eventos" className="text-sm text-azul hover:underline">
                    Ver bitácora
                  </Link>
                </div>
                <BarList items={stats.byType.map((t) => ({ label: t.type, value: t.count }))} />
                <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
                  Trazabilidad: {formatNumber(stats.correlated)} de {formatNumber(stats.total)} eventos
                  ({traceability}%) traen correlationId. Los servicios de negocio no lo propagan.
                </p>
              </div>
            </div>
          )}
        </section>
      </Reveal>
    </div>
  )
}
