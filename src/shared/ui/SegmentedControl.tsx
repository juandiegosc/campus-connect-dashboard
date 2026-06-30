import type { AttendanceStatus } from '@/types/api'

interface Option {
  value: AttendanceStatus
  label: string
}

const OPTIONS: Option[] = [
  { value: 'Present', label: 'Presente' },
  { value: 'Absent', label: 'Ausente' },
  { value: 'Late', label: 'Tarde' },
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
      className="inline-flex overflow-hidden rounded-lg border border-line"
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
            className={`px-3 py-1.5 text-xs ${i > 0 ? 'border-l border-line' : ''} ${
              active ? `${selectedClass[opt.value]} font-medium` : 'text-muted hover:bg-panel'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
