import type { TableColumn } from '../../types/finance'
import { StatusBadge } from './StatusBadge'

export function MobileCardList<T extends Record<string, unknown>>({ rows, columns }: { rows: T[]; columns: TableColumn<T>[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {rows.map((row, index) => (
        <article key={String(row.id ?? index)} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
          {columns.map((column) => {
            const raw = row[column.key as keyof T]
            const value = column.render ? column.render(row) : column.key === 'status' ? <StatusBadge value={raw} /> : String(raw ?? '-')
            return (
              <div key={String(column.key)} className="flex items-center justify-between gap-4 border-b border-white/5 py-2 last:border-b-0">
                <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">{column.header}</span>
                <span className="text-right text-sm font-medium text-white">{value}</span>
              </div>
            )
          })}
        </article>
      ))}
    </div>
  )
}
