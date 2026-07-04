import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'

export function SimplePage({ title, subtitle, icon: Icon, items }: { title: string; subtitle: string; icon: LucideIcon; items: string[] }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} icon={Icon} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => <GlassCard key={item} className="p-5 text-slate-200">{item}</GlassCard>)}
      </div>
    </div>
  )
}
