import { motion } from 'framer-motion'
import { ChartGrid } from '../components/charts/FinanceCharts'
import { AIInsightCard } from '../components/cards/AIInsightCard'
import { StatCard } from '../components/cards/StatCard'
import { dashboardStats } from '../constants/finance'

export function DashboardPage() {
  return (
    <div>
      <section className="aurora-card mb-7 overflow-hidden rounded-[28px] border border-gray-100 p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.18em] text-[#E76F51]">Diptish Gohane Finance OS</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-[#111827] md:text-5xl">Your money, beautifully organized.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">A clean mobile-first finance app for planning cashflow, closing loans, saving for goals, and staying calm about every rupee.</p>
        </motion.div>
      </section>
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>
      <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_360px]">
        <ChartGrid />
        <AIInsightCard />
      </div>
    </div>
  )
}
