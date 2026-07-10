import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNotifications } from '@/features/notifications/useNotifications'
import { SendNotificationForm } from '@/features/notifications/SendNotificationForm'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Card } from '@/shared/ui/Card'
import { Spinner } from '@/shared/ui/Spinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Reveal } from '@/shared/ui/Reveal'
import { DataTable } from '@/shared/ui/DataTable'
import type { Column } from '@/shared/ui/DataTable'
import { formatDateTime, formatNumber } from '@/shared/lib/format'
import type { NotificationDto, NotificationStatus } from '@/types/api'

const TAKE = 100
const FILTERS: { value: NotificationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'Sent', label: 'Enviadas' },
  { value: 'Failed', label: 'Fallidas' },
]

export function NotificationsPage() {
  // El informe enlaza aquí con ?estado=Failed al hacer clic en "Mensajes fallidos".
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = (searchParams.get('estado') ?? 'all') as NotificationStatus | 'all'

  const { data, isLoading, isError } = useNotifications(TAKE)
  const notifications = useMemo(() => data ?? [], [data])

  const filtered = useMemo(
    () => (filter === 'all' ? notifications : notifications.filter((n) => n.status === filter)),
    [notifications, filter],
  )

  const failed = notifications.filter((n) => n.status === 'Failed').length

  const columns: Column<NotificationDto>[] = [
    {
      key: 'status',
      header: 'Estado',
      render: (notification) => <StatusBadge status={notification.status} />,
    },
    {
      key: 'subject',
      header: 'Asunto',
      render: (notification) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{notification.subject}</p>
          <p className="truncate text-sm text-muted">{notification.recipient}</p>
          {notification.failureReason && (
            <p className="mt-1 text-sm text-absent">{notification.failureReason}</p>
          )}
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Canal',
      hideBelow: 'sm',
      render: (notification) => <span className="text-muted">{notification.channel}</span>,
    },
    {
      key: 'source',
      header: 'Origen',
      hideBelow: 'md',
      render: (notification) => <span className="text-muted">{notification.sourceEvent}</span>,
    },
    {
      key: 'created',
      header: 'Creada',
      align: 'right',
      render: (notification) => (
        <span className="tabular text-muted">{formatDateTime(notification.createdAt)}</span>
      ),
    },
  ]

  return (
    <Reveal>
      <PageHeader
        title="Notificaciones"
        subtitle="Cada evento del ecosistema genera una notificación simulada. También puedes encolar una a mano."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() =>
                  setSearchParams(option.value === 'all' ? {} : { estado: option.value })
                }
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  filter === option.value
                    ? 'border-azul bg-azul text-white'
                    : 'border-line bg-white text-muted hover:border-azul/40 hover:text-ink'
                }`}
              >
                {option.label}
                {option.value === 'Failed' && failed > 0 && ` (${failed})`}
              </button>
            ))}
            <span className="tabular ml-auto text-sm text-muted">
              {formatNumber(filtered.length)} de {formatNumber(notifications.length)}
            </span>
          </div>

          {isLoading ? (
            <Spinner label="Cargando notificaciones…" />
          ) : isError ? (
            <EmptyState
              icon="ti-alert-triangle"
              title="No se pudieron cargar las notificaciones"
              message="Revisa que el Gateway y el servicio de Notifications estén arriba."
            />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon="ti-bell"
              title="No hay notificaciones"
              message="Se generan cuando el ecosistema publica eventos, o cuando encolas un envío desde aquí."
            />
          ) : filtered.length === 0 ? (
            <Card className="p-6">
              <p className="py-10 text-center text-base text-muted">
                Ninguna notificación con ese estado.
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <DataTable
                columns={columns}
                rows={filtered}
                getKey={(notification) => notification.notificationId}
                caption="Notificaciones simuladas registradas por el servicio"
              />
            </Card>
          )}
        </div>

        <SendNotificationForm />
      </div>
    </Reveal>
  )
}

function StatusBadge({ status }: { status: NotificationStatus }) {
  const sent = status === 'Sent'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium ${
        sent ? 'bg-present-bg text-present-ink' : 'bg-absent-bg text-absent-ink'
      }`}
    >
      <i className={`ti ${sent ? 'ti-circle-check' : 'ti-alert-triangle'}`} aria-hidden="true" />
      {sent ? 'Enviada' : 'Fallida'}
    </span>
  )
}
