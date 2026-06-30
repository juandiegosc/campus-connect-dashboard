import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'motion/react'

// Selector de fecha con calendario en popover (react-day-picker), estilo UDLA.
export function DatePicker({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-4 py-2.5 text-base font-medium text-ink shadow-card transition hover:border-vino/40"
      >
        <i className="ti ti-calendar-event text-lg text-vino" aria-hidden="true" />
        <span className="capitalize">{format(value, "EEEE d 'de' MMMM", { locale: es })}</span>
        <i className="ti ti-chevron-down text-muted" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 z-30 mt-2 rounded-2xl border border-line bg-white p-2 shadow-pop"
          >
            <DayPicker
              mode="single"
              required
              selected={value}
              onSelect={(d) => {
                if (d) {
                  onChange(d)
                  setOpen(false)
                }
              }}
              locale={es}
              weekStartsOn={1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
