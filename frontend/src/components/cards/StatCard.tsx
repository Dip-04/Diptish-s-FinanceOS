import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { currency } from '../../utils/format'

type StatCardProps = {
  label: string
  value: number
  icon: LucideIcon
  accent: string
  suffix?: string
}

export function StatCard({ label, value, icon: Icon, accent, suffix }: StatCardProps) {
  return (
    <motion.article whileHover={{ y: -4 }} className="glass rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <strong className="mt-2 block text-2xl font-semibold tracking-normal text-slate-50">
            {suffix ? `${value}${suffix}` : currency(value)}
          </strong>
        </div>
        <span className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-slate-950 shadow-lg shadow-cyan-500/10`}>
          <Icon size={20} />
        </span>
      </div>
    </motion.article>
  )
}
