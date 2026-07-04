import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

type GlassCardProps = PropsWithChildren<{ className?: string; delay?: number }>

export function GlassCard({ children, className = '', delay = 0 }: GlassCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`glass rounded-3xl ${className}`}
    >
      {children}
    </motion.section>
  )
}
