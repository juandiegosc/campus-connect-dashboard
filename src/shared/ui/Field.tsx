import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  error?: string
  children: ReactNode
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-base font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-absent">{error}</span>}
    </label>
  )
}
