import { Camera, UserRound } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'

const fields = ['Full name', 'Email', 'Phone number', 'Currency preference', 'Monthly salary', 'Default budget', 'Financial goal', 'Notification preferences', 'Family members']

export function ProfilePage() {
  return (
    <div>
      <PageHeader title="User Profile" subtitle="Edit identity, currency, budget defaults, family, and notification preferences." icon={UserRound} />
      <GlassCard className="p-5">
        <div className="mb-6 flex items-center gap-4">
          <button className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#C6FF3D] to-[#F5C76B] text-[#111111]" aria-label="Upload profile photo"><Camera /></button>
          <div>
            <h2 className="text-2xl font-semibold text-white">Diptish Gohane</h2>
            <p className="text-sm text-zinc-400">diptish@example.com</p>
          </div>
        </div>
        <form className="grid gap-3 md:grid-cols-2">
          {fields.map((field) => <input key={field} placeholder={field} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />)}
          <button className="rounded-2xl bg-gradient-to-r from-[#C6FF3D] to-[#F5C76B] px-4 py-3 font-semibold text-[#111111] md:col-span-2">Save profile</button>
        </form>
      </GlassCard>
    </div>
  )
}
