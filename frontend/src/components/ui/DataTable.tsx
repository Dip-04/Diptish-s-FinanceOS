import type { TableColumn } from '../../types/finance'
import { StatusBadge } from './StatusBadge'

type DataTableProps<T extends Record<string, unknown>> = {
  rows: T[]
  columns: TableColumn<T>[]
}

export function DataTable<T extends Record<string, unknown>>({ rows, columns }: DataTableProps<T>) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
          <tr>{columns.map((column) => <th key={String(column.key)} className="px-4 py-3 font-semibold">{column.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={String(row.id ?? rowIndex)} className="bg-white/[0.045] text-slate-200">
              {columns.map((column) => {
                const raw = row[column.key as keyof T]
                const value = column.render ? column.render(row) : column.key === 'status' ? <StatusBadge value={raw} /> : String(raw ?? '-')
                return <td key={String(column.key)} className="border-y border-white/5 first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r px-4 py-4">{value}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
