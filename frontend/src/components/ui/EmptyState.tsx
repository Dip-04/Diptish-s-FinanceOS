import { Inbox } from 'lucide-react'

export function EmptyState({ title = 'No records yet' }: { title?: string }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-gray-200 bg-[#F9FAFB] px-6 py-14 text-center">
      <Inbox className="text-gray-400" size={34} />
      <h3 className="mt-4 text-lg font-semibold text-[#111827]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-gray-500">Add the first record to start turning scattered money data into decisions.</p>
    </div>
  )
}
