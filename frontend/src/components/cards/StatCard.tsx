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
    <motion.article whileHover={{ y: -3 }} className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-[0_14px_30px_rgba(17,24,39,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <strong className="mt-2 block text-2xl font-semibold tracking-normal text-[#111827]">
            {suffix ? `${value}${suffix}` : currency(value)}
          </strong>
        </div>
        <span className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white`}>
          <Icon size={20} />
        </span>
      </div>
    </motion.article>
  )
}
