import { FileUp } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

export function OCRUploadCard({ title, description }: { title: string; description: string }) {
  return (
    <GlassCard className="p-5">
      <div className="rounded-3xl border border-dashed border-[#2A9D8F]/30 bg-[#2A9D8F]/5 p-8 text-center">
        <FileUp className="mx-auto text-[#2A9D8F]" size={34} />
        <h3 className="mt-4 text-xl font-semibold text-[#111827]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
        <input type="file" className="mt-5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600" />
      </div>
    </GlassCard>
  )
}
