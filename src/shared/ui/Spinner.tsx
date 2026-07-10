export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-base text-muted">
      <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-line border-t-azul" />
      {label}
    </div>
  )
}
