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
                <h2 className="text-xl font-semibold text-[#111827]">{plan.month}</h2>
                {remaining < 0 ? <AlertTriangle className="text-rose-300" /> : <CheckCircle2 className="text-emerald-300" />}
              </div>
              <p className="mt-2 text-sm text-gray-500">Income {currency(plan.income)}</p>
              <div className="mt-5 space-y-3">
                {plan.items.map(([name, amount]) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
                    <span className="text-gray-600">{name}</span>
                    <strong className="text-[#111827]">{currency(amount)}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
                <p className="text-sm text-gray-500">Remaining balance</p>
                <strong className={`text-2xl ${remaining < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{currency(remaining)}</strong>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
