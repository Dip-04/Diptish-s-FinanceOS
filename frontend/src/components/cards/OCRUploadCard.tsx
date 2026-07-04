import { FileUp } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

export function OCRUploadCard({ title, description }: { title: string; description: string }) {
  return (
    <GlassCard className="p-5">
      <div className="rounded-3xl border border-dashed border-[#C6FF3D]/30 bg-[#C6FF3D]/5 p-8 text-center">
        <FileUp className="mx-auto text-[#C6FF3D]" size={34} />
        <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        <input type="file" className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-zinc-300" />
      </div>
    </GlassCard>
  )
}
