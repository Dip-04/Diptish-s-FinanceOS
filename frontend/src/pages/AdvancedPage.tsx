import type { LucideIcon } from 'lucide-react'
import { BentoCard } from '../components/cards/BentoCard'
import { PageHeader } from '../components/ui/PageHeader'

type AdvancedPageProps = {
  title: string
  subtitle: string
  icon: LucideIcon
  cards: Array<{ title: string; value: string; detail: string; icon: LucideIcon }>
  disclaimer?: string
}

export function AdvancedPage({ title, subtitle, icon, cards, disclaimer }: AdvancedPageProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} icon={icon} />
      {disclaimer && <div className="mb-5 rounded-3xl border border-[#F5C76B]/20 bg-[#F5C76B]/10 p-4 text-sm text-[#F5C76B]">{disclaimer}</div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => <BentoCard key={card.title} {...card} />)}
      </div>
    </div>
  )
}
