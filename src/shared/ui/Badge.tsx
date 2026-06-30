import type { ReactNode } from 'react'

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm ${className}`}>
      {children}
    </span>
  )
}
