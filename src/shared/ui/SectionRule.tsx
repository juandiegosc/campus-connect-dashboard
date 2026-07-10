/**
 * Rótulo de sección del informe: eyebrow + regla dorada al ancho disponible.
 *
 * Los eyebrows nombran los bounded contexts del backend (Matrícula, Finanzas, Operación,
 * Mensajería). No se numeran: no son una secuencia, son un mapa.
 */
export function SectionRule({ eyebrow, hint }: { eyebrow: string; hint?: string }) {
  return (
    <div className="mb-7 flex items-center gap-5">
      <h2 className="eyebrow shrink-0">{eyebrow}</h2>
      <div className="h-px flex-1 bg-oro/40" />
      {hint && <p className="shrink-0 text-sm text-muted">{hint}</p>}
    </div>
  )
}
