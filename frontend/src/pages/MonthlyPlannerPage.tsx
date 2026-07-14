import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { getErrorMessage } from '../services/api'
import { getPlannerReport } from '../services/reports'
import { useToastStore } from '../store/useToastStore'
import type { PlannerMonth } from '../types/finance'
import { currency } from '../utils/format'

export function MonthlyPlannerPage() {
  const showToast = useToastStore((state) => state.showToast)
  const [plans, setPlans] = useState<PlannerMonth[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadPlanner() {
      setIsLoading(true)
      try {
        const data = await getPlannerReport()
        if (!active) return
        setPlans(data)
      } catch (error) {
        if (!active) return
        showToast({ type: 'warning', title: 'Could not load planner', message: getErrorMessage(error, 'We could not load monthly planner data from the API.') })
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadPlanner()

    return () => {
      active = false
    }
  }, [showToast])

  return (
    <div>
      <PageHeader title="Monthly Planner" subtitle="Month-wise planned vs actual cashflow, shortfall, balance, savings, and payment state." icon={CheckCircle2} />
      {isLoading ? (
        <GlassCard className="p-6">
          <LoadingState title="Loading monthly planner..." />
        </GlassCard>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {plans.map((plan) => (
            <GlassCard key={plan.month} className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#111827]">{plan.month}</h2>
                {plan.remaining < 0 ? <AlertTriangle className="text-rose-300" /> : <CheckCircle2 className="text-emerald-300" />}
              </div>
              <p className="mt-2 text-sm text-gray-500">Income {currency(plan.income)}</p>
              <div className="mt-5 space-y-3">
                {plan.items.map((item) => (
                  <div key={`${plan.month}-${item.name}-${item.amount}`} className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <strong className="text-[#111827]">{currency(item.amount)}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
                <p className="text-sm text-gray-500">Remaining balance</p>
                <strong className={`text-2xl ${plan.remaining < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{currency(plan.remaining)}</strong>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
