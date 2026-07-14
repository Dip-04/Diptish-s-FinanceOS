import { motion } from 'framer-motion'

export function LoadingState({ title = 'Loading records...' }: { title?: string }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-gray-200 bg-[#F9FAFB] px-6 py-14 text-center">
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-3 w-3 rounded-full bg-[#2A9D8F]"
            animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.12, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#111827]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-gray-500">Waiting for the latest data from the API.</p>
    </div>
  )
}
