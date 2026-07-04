import { motion } from 'framer-motion'
import { ChartGrid } from '../components/charts/FinanceCharts'
import { AIInsightCard } from '../components/cards/AIInsightCard'
import { StatCard } from '../components/cards/StatCard'
import { dashboardStats } from '../constants/finance'

export function DashboardPage() {
  return (
    <div>
      <section className="aurora-card mb-7 overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-2xl shadow-black/40 md:p-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.24em] text-[#C6FF3D]">Diptish Gohane Finance OS</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-white md:text-6xl">A premium operating system for every rupee.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">Control every rupee. Plan every dream. Let AI, OCR, voice, and family budgeting turn money chaos into a calm plan.</p>
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
