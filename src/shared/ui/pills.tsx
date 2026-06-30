import type { AttendanceStatus, IncidentSeverity } from '@/types/api'

const statusMap: Record<AttendanceStatus, { label: string; cls: string }> = {
  Present: { label: 'Presente', cls: 'bg-present-bg text-present-ink' },
  Absent: { label: 'Ausente', cls: 'bg-absent-bg text-absent-ink' },
  Late: { label: 'Tarde', cls: 'bg-late-bg text-late-ink' },
}

export function StatusPill({ status }: { status: AttendanceStatus }) {
  const m = statusMap[status]
  return <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${m.cls}`}>{m.label}</span>
}

const severityMap: Record<IncidentSeverity, { label: string; cls: string }> = {
  Low: { label: 'Baja', cls: 'bg-present-bg text-present-ink' },
  Medium: { label: 'Media', cls: 'bg-late-bg text-late-ink' },
  High: { label: 'Alta', cls: 'bg-absent-bg text-absent-ink' },
}

export function SeverityPill({ severity }: { severity: IncidentSeverity }) {
  const m = severityMap[severity]
  return <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${m.cls}`}>{m.label}</span>
}
