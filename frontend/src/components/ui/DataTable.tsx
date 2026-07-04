import type { TableColumn } from '../../types/finance'
import type { ReactNode } from 'react'
import { StatusBadge } from './StatusBadge'

type DataTableProps<T extends Record<string, unknown>> = {
  rows: T[]
  columns: TableColumn<T>[]
  renderActions?: (row: T) => ReactNode
}

export function DataTable<T extends Record<string, unknown>>({ rows, columns, renderActions }: DataTableProps<T>) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.16em] text-gray-400">
          <tr>
            {columns.map((column) => <th key={String(column.key)} className="px-4 py-3 font-semibold">{column.header}</th>)}
            {renderActions && <th className="px-4 py-3 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={String(row.id ?? rowIndex)} className="bg-[#F9FAFB] text-gray-700">
              {columns.map((column) => {
                const raw = row[column.key as keyof T]
                const value = column.render ? column.render(row) : column.key === 'status' ? <StatusBadge value={raw} /> : String(raw ?? '-')
                return <td key={String(column.key)} className="border-y border-gray-100 px-4 py-4 first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r">{value}</td>
              })}
              {renderActions && <td className="border-y border-r border-gray-100 px-4 py-4 last:rounded-r-2xl">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
