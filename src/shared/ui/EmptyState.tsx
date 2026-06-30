import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  message?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {icon && <i className={`ti ${icon} text-3xl text-muted`} aria-hidden="true" />}
      <p className="font-medium text-ink">{title}</p>
      {message && <p className="max-w-md text-sm text-muted">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
