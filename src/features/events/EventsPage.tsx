import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useEvents } from '@/features/events/useEvents'
import { deriveEventStats } from '@/features/dashboard/deriveEventStats'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Card } from '@/shared/ui/Card'
import { Spinner } from '@/shared/ui/Spinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Reveal } from '@/shared/ui/Reveal'
import { DataTable } from '@/shared/ui/DataTable'
import type { Column } from '@/shared/ui/DataTable'
import { controlClass } from '@/shared/ui/styles'
import { formatDateTime, formatLag, formatNumber } from '@/shared/lib/format'
import type { EventLogDto } from '@/types/api'

const TAKE = 500

function lagOf(event: EventLogDto): number {
  return new Date(event.receivedAt).getTime() - new Date(event.occurredAt).getTime()
}

/** ULID de 26 caracteres: mostramos los últimos 8, que es lo que distingue una entidad de otra. */
function shortId(id: string): string {
  return id.length > 10 ? `…${id.slice(-8)}` : id
}

export function EventsPage() {
  const { data, isLoading, isError } = useEvents(TAKE)
  const [type, setType] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const events = useMemo(() => data ?? [], [data])
  const stats = useMemo(() => deriveEventStats(events), [events])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return events.filter((event) => {
      if (type && event.eventType !== type) return false
      if (!needle) return true
      return (
        event.entityId.toLowerCase().includes(needle) ||
        (event.correlationId?.toLowerCase().includes(needle) ?? false)
      )
    })
  }, [events, type, search])

  const columns: Column<EventLogDto>[] = [
    {
      key: 'type',
      header: 'Evento',
      render: (event) => <span className="font-medium">{event.eventType}</span>,
    },
    {
      key: 'entity',
      header: 'Entidad',
      hideBelow: 'sm',
      render: (event) => (
        <span className="tabular text-muted" title={event.entityId}>
          {shortId(event.entityId)}
        </span>
      ),
    },
    {
      key: 'correlation',
      header: 'Correlación',
      hideBelow: 'md',
      render: (event) =>
        event.correlationId ? (
          <span className="tabular text-muted" title={event.correlationId}>
            {shortId(event.correlationId)}
          </span>
        ) : (
          <span className="text-muted" title="El servicio publicador no propagó el correlationId">
            —
          </span>
        ),
    },
    {
      key: 'occurred',
      header: 'Ocurrió',
      render: (event) => <span className="tabular text-muted">{formatDateTime(event.occurredAt)}</span>,
    },
    {
      key: 'lag',
      header: 'Retraso',
      align: 'right',
      render: (event) => <span className="tabular text-muted">{formatLag(lagOf(event))}</span>,
    },
  ]

  if (isLoading) {
    return (
      <>
        <PageHeader title="Bitácora de eventos" />
        <Spinner label="Leyendo la bitácora…" />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Bitácora de eventos" />
        <EmptyState
          icon="ti-alert-triangle"
          title="No se pudo leer la bitácora"
          message="Analytics no respondió. Revisa que el Gateway y el servicio de Analytics estén arriba."
        />
      </>
    )
  }

  const traceability = stats.total === 0 ? 0 : Math.round((stats.correlated / stats.total) * 100)

  return (
    <Reveal>
      <PageHeader
        title="Bitácora de eventos"
        subtitle={`Los últimos ${formatNumber(TAKE)} eventos que Analytics ingirió, en orden de llegada.`}
      />

      {events.length === 0 ? (
        <EmptyState
          icon="ti-timeline-event"
          title="La bitácora está vacía"
          message="Analytics aún no ha ingerido ningún evento. Matricula un estudiante desde el portal de Secretaría para verla llenarse."
        />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={type === null} onClick={() => setType(null)}>
                Todos ({formatNumber(stats.total)})
              </FilterChip>
              {stats.byType.map((item) => (
                <FilterChip
                  key={item.type}
                  active={type === item.type}
                  onClick={() => setType(type === item.type ? null : item.type)}
                >
                  {item.type} ({item.count})
                </FilterChip>
              ))}
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por entidad o correlationId"
              aria-label="Buscar por entidad o correlationId"
              className={`${controlClass} sm:ml-auto sm:w-80`}
            />
          </div>

          <p className="mb-6 border-l-2 border-oro/50 pl-4 text-base text-muted">
            <span className="tabular text-ink">
              {formatNumber(stats.correlated)} de {formatNumber(stats.total)} eventos ({traceability}%)
            </span>{' '}
            traen correlationId. Los eventos publicados por los servicios de negocio —{' '}
            <span className="text-ink">StudentEnrolled</span>,{' '}
            <span className="text-ink">PaymentConfirmed</span>,{' '}
            <span className="text-ink">AttendanceRecorded</span> e{' '}
            <span className="text-ink">IncidentReported</span> — lo omiten, así que las cadenas de
            trazabilidad del contrato §8 no se pueden reconstruir todavía.
          </p>

          <Card className="p-6">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-base text-muted">
                Ningún evento coincide con el filtro.
              </p>
            ) : (
              <DataTable
                columns={columns}
                rows={filtered}
                getKey={(event) => `${event.eventType}-${event.entityId}-${event.receivedAt}`}
                caption="Eventos de integración procesados por Analytics"
              />
            )}
          </Card>
        </>
      )}
    </Reveal>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-azul bg-azul text-white'
          : 'border-line bg-white text-muted hover:border-azul/40 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
