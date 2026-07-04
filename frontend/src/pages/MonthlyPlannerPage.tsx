import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'
import { monthlyPlans } from '../constants/finance'
import { currency } from '../utils/format'

export function MonthlyPlannerPage() {
  return (
    <div>
      <PageHeader title="Monthly Planner" subtitle="Month-wise planned vs actual cashflow, shortfall, balance, savings, and payment state." icon={CheckCircle2} />
      <div className="grid gap-5 xl:grid-cols-3">
        {monthlyPlans.map((plan) => {
          const expenses = plan.items.reduce((sum, item) => sum + item[1], 0)
          const remaining = plan.income - expenses
          return (
            <GlassCard key={plan.month} className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-50">{plan.month}</h2>
                {remaining < 0 ? <AlertTriangle className="text-rose-300" /> : <CheckCircle2 className="text-emerald-300" />}
              </div>
              <p className="mt-2 text-sm text-slate-400">Income {currency(plan.income)}</p>
              <div className="mt-5 space-y-3">
                {plan.items.map(([name, amount]) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl bg-white/[0.045] px-4 py-3 text-sm">
                    <span className="text-slate-300">{name}</span>
                    <strong className="text-slate-50">{currency(amount)}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm text-slate-400">Remaining balance</p>
                <strong className={`text-2xl ${remaining < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{currency(remaining)}</strong>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
