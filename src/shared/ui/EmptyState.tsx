import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  message?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && (
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-vino-soft">
          <i className={`ti ${icon} text-3xl text-vino`} aria-hidden="true" />
        </span>
      )}
      <p className="text-lg font-medium text-ink">{title}</p>
      {message && <p className="max-w-md text-base text-muted">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
