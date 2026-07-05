import { motion } from 'framer-motion'
import { ChartGrid } from '../components/charts/FinanceCharts'
import { StatCard } from '../components/cards/StatCard'
import { dashboardStats, monthlyPlans } from '../constants/finance'
import { GlassCard } from '../components/ui/GlassCard'
import { currency } from '../utils/format'

export function DashboardPage() {
  const currentPlan = monthlyPlans[0]
  const plannedExpenses = currentPlan.items.reduce((sum, item) => sum + item[1], 0)
  const remaining = currentPlan.income - plannedExpenses

  return (
    <div>
      <section className="aurora-card mb-7 overflow-hidden rounded-[28px] border border-gray-100 p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.18em] text-[#E76F51]">Diptish Gohane Finance OS</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">Simple monthly money tracker.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">Add income, track monthly and daily expenses, plan payments, follow loans and EMIs, and see what remains.</p>
        </motion.div>
      </section>
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>
      <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_360px]">
        <ChartGrid />
        <GlassCard className="p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-[#E76F51]">This month</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111827]">{currentPlan.month}</h2>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
              <span className="text-gray-600">Income</span>
              <strong className="text-[#111827]">{currency(currentPlan.income)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
              <span className="text-gray-600">Planned payments</span>
              <strong className="text-[#111827]">{currency(plannedExpenses)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
              <span className="text-gray-600">Remaining balance</span>
              <strong className={remaining < 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}>{currency(remaining)}</strong>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
