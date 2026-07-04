import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

export function BentoCard({ title, value, detail, icon: Icon }: { title: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <strong className="mt-2 block text-2xl font-semibold text-white">{value}</strong>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{detail}</p>
        </div>
        <span className="rounded-2xl bg-[#C6FF3D]/12 p-3 text-[#C6FF3D]"><Icon size={22} /></span>
      </div>
    </GlassCard>
  )
}
