import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type ToastKind = 'success' | 'error'

interface Toast {
  id: number
  kind: ToastKind
  message: string
}

export interface ToastContextValue {
  notify: (kind: ToastKind, message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white ${
              t.kind === 'success' ? 'bg-present' : 'bg-absent'
            }`}
          >
            <i
              className={`ti ${t.kind === 'success' ? 'ti-check' : 'ti-alert-triangle'}`}
              aria-hidden="true"
            />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
