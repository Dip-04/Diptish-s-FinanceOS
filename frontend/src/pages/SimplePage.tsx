import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'

export function SimplePage({ title, subtitle, icon: Icon, items }: { title: string; subtitle: string; icon: LucideIcon; items: string[] }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} icon={Icon} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <GlassCard key={item} className="flex min-h-24 items-center p-5 text-base font-semibold text-[#111827]">
            {item}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
