import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeIndianRupee, Banknote, Landmark, PiggyBank, ReceiptText, WalletCards } from 'lucide-react'
import { ChartGrid } from '../components/charts/FinanceCharts'
import { StatCard } from '../components/cards/StatCard'
import { GlassCard } from '../components/ui/GlassCard'
import { LoadingState } from '../components/ui/LoadingState'
import { getErrorMessage } from '../services/api'
import { getCashflowReport, getCategoryReport, getPlannerReport, getReportSummary } from '../services/reports'
import { useToastStore } from '../store/useToastStore'
import type { CategoryPoint, MoneyPoint, PlannerMonth, ReportSummary } from '../types/finance'
import { currency } from '../utils/format'

const emptySummary: ReportSummary = { income: 0, expenses: 0, savings: 0, debt: 0, remaining: 0, upcomingEmi: 0 }

export function DashboardPage() {
  const showToast = useToastStore((state) => state.showToast)
  const [summary, setSummary] = useState<ReportSummary>(emptySummary)
  const [cashflow, setCashflow] = useState<MoneyPoint[]>([])
  const [categories, setCategories] = useState<CategoryPoint[]>([])
  const [planner, setPlanner] = useState<PlannerMonth[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setIsLoading(true)
      try {
        const [summaryData, cashflowData, categoryData, plannerData] = await Promise.all([
          getReportSummary(),
          getCashflowReport(),
          getCategoryReport(),
          getPlannerReport(),
        ])

        if (!active) return
        setSummary(summaryData)
        setCashflow(cashflowData)
        setCategories(categoryData)
        setPlanner(plannerData)
      } catch (error) {
        if (!active) return
        showToast({ type: 'warning', title: 'Could not load dashboard', message: getErrorMessage(error, 'We could not load dashboard data from the API.') })
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadDashboard()

    return () => {
      active = false
    }
  }, [showToast])

  const currentPlan = planner[0]

  const stats = useMemo(() => ([
    { label: 'Remaining Balance', value: summary.remaining, icon: BadgeIndianRupee, accent: 'from-[#111827] to-[#2A9D8F]' },
    { label: 'Monthly Income', value: summary.income, icon: Banknote, accent: 'from-[#2A9D8F] to-[#111827]' },
    { label: 'Monthly Expenses', value: summary.expenses, icon: ReceiptText, accent: 'from-[#E76F51] to-[#DC2626]' },
    { label: 'Savings', value: summary.savings, icon: PiggyBank, accent: 'from-[#16A34A] to-[#2A9D8F]' },
    { label: 'Loan Balance', value: summary.debt, icon: Landmark, accent: 'from-[#111827] to-[#E76F51]' },
    { label: 'Upcoming EMI', value: summary.upcomingEmi, icon: WalletCards, accent: 'from-[#E9C46A] to-[#E76F51]' },
  ]), [summary])

  return (
    <div>
      <section className="aurora-card mb-7 overflow-hidden rounded-[28px] border border-gray-100 p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.18em] text-[#E76F51]">Diptish Gohane Finance OS</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">Simple monthly money tracker.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">Add income, track monthly and daily expenses, plan payments, follow loans and EMIs, and see what remains.</p>
        </motion.div>
      </section>
      {isLoading ? (
        <GlassCard className="p-6">
          <LoadingState title="Loading dashboard..." />
        </GlassCard>
      ) : (
        <>
          <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </section>
          <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_360px]">
            <ChartGrid cashflow={cashflow} categories={categories} />
            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[#E76F51]">This month</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#111827]">{currentPlan?.month ?? 'No month data yet'}</h2>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
                  <span className="text-gray-600">Income</span>
                  <strong className="text-[#111827]">{currency(currentPlan?.income ?? 0)}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
                  <span className="text-gray-600">Planned payments</span>
                  <strong className="text-[#111827]">{currency(currentPlan?.expenses ?? 0)}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm">
                  <span className="text-gray-600">Remaining balance</span>
                  <strong className={(currentPlan?.remaining ?? 0) < 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}>{currency(currentPlan?.remaining ?? 0)}</strong>
                </div>
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  )
}
