import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

export function BentoCard({ title, value, detail, icon: Icon }: { title: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <strong className="mt-2 block text-2xl font-semibold text-[#111827]">{value}</strong>
          <p className="mt-3 text-sm leading-6 text-gray-600">{detail}</p>
        </div>
        <span className="rounded-2xl bg-[#F1F5F9] p-3 text-[#E76F51]"><Icon size={22} /></span>
      </div>
    </GlassCard>
  )
}
