import { Inbox } from 'lucide-react'

export function EmptyState({ title = 'No records yet' }: { title?: string }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
      <Inbox className="text-slate-500" size={34} />
      <h3 className="mt-4 text-lg font-semibold text-slate-200">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">Add the first record to start turning scattered money data into decisions.</p>
    </div>
  )
}
