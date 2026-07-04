import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { PropsWithChildren } from 'react'

type ModalProps = PropsWithChildren<{ title: string; open: boolean; onClose: () => void }>

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid items-end bg-black/60 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
      <motion.div initial={{ opacity: 0, scale: 0.98, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass max-h-[88svh] w-full overflow-y-auto rounded-t-[2rem] p-5 sm:max-w-2xl sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
          <button onClick={onClose} className="rounded-2xl border border-white/10 p-2 text-slate-300 hover:bg-white/10" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}
