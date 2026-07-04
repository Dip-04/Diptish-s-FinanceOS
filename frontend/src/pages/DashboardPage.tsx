import { motion } from 'framer-motion'
import { ChartGrid } from '../components/charts/FinanceCharts'
import { AIInsightCard } from '../components/cards/AIInsightCard'
import { StatCard } from '../components/cards/StatCard'
import { dashboardStats } from '../constants/finance'

export function DashboardPage() {
  return (
    <div>
      <section className="mb-7 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-300/15 via-white/[0.06] to-violet-500/15 p-6 shadow-2xl shadow-cyan-950/30 md:p-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Diptish's Finance OS</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-slate-50 md:text-6xl">Plan, track, grow, and achieve financial freedom.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Control every rupee. Plan every goal. Build your wealth with an AI-powered financial brain.</p>
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
