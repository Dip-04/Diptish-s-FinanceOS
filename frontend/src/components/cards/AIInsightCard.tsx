import { Bot, Sparkles } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

export function AIInsightCard() {
  return (
    <GlassCard className="overflow-hidden p-6">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-[#F1F5F9] p-3 text-[#E76F51]"><Bot size={22} /></span>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#E76F51]">AI financial brain</p>
          <h3 className="text-xl font-semibold text-slate-50">July has high debt pressure.</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        Avoid new purchases until September. Paying Slice before optional spending can free up cashflow and reduce interest drag.
      </p>
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#F5C76B]">
        <Sparkles size={16} />
        Best move: close highest interest debt first.
      </div>
    </GlassCard>
  )
}
