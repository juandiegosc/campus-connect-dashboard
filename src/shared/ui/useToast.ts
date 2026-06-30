import { useContext } from 'react'
import { ToastContext } from '@/shared/ui/toast'

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
