import type { AttendanceStatus } from '@/types/api'

interface Option {
  value: AttendanceStatus
  label: string
  icon: string
}

const OPTIONS: Option[] = [
  { value: 'Present', label: 'Presente', icon: 'ti-check' },
  { value: 'Absent', label: 'Ausente', icon: 'ti-x' },
  { value: 'Late', label: 'Tarde', icon: 'ti-clock' },
]

const selectedClass: Record<AttendanceStatus, string> = {
  Present: 'bg-present-bg text-present-ink',
  Absent: 'bg-absent-bg text-absent-ink',
  Late: 'bg-late-bg text-late-ink',
}

interface Props {
  value: AttendanceStatus | null
  onChange: (value: AttendanceStatus) => void
  name: string
}

export function AttendanceSegmented({ value, onChange, name }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label={`Estado de ${name}`}
      className="inline-flex overflow-hidden rounded-xl border border-line"
    >
      {OPTIONS.map((opt, i) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors ${
              i > 0 ? 'border-l border-line' : ''
            } ${active ? `${selectedClass[opt.value]} font-medium` : 'text-muted hover:bg-panel'}`}
          >
            <i className={`ti ${opt.icon}`} aria-hidden="true" />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
