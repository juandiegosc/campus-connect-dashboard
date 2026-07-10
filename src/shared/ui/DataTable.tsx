import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right'
  /** Ocultar en pantallas angostas cuando la columna es secundaria. */
  hideBelow?: 'sm' | 'md' | 'lg'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getKey: (row: T) => string
  caption?: string
}

const hideClass: Record<NonNullable<Column<never>['hideBelow']>, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
}

/**
 * Tabla editorial: hairlines, cabecera en versalitas, cifras tabulares. Sin zebra striping
 * ni bordes de caja — las reglas horizontales bastan para seguir la fila.
 */
export function DataTable<T>({ columns, rows, getKey, caption }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-oro/40">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`eyebrow pb-3 pr-6 last:pr-0 ${
                  col.align === 'right' ? 'text-right' : ''
                } ${col.hideBelow ? hideClass[col.hideBelow] : ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)} className="border-b border-line transition-colors hover:bg-panel">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3.5 pr-6 text-base text-ink last:pr-0 ${
                    col.align === 'right' ? 'text-right' : ''
                  } ${col.hideBelow ? hideClass[col.hideBelow] : ''}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
