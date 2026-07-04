import { useState } from 'react'
import { Camera, KeyRound, Loader2, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'
import { changePassword, updateProfile } from '../services/auth'
import { useAuthStore } from '../store/useAuthStore'

const profileSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP', 'AED']),
  monthlySalary: z.number().min(0),
  defaultBudget: z.number().min(0),
  financialGoal: z.string().optional(),
  notificationPreferences: z.string().optional(),
  familyMembers: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ProfileValues = z.infer<typeof profileSchema>
type PasswordValues = z.infer<typeof passwordSchema>

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const setAuth = useAuthStore((state) => state.setAuth)
  const rememberMe = useAuthStore((state) => state.rememberMe)
  const session = useAuthStore((state) => state.session)
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [changing, setChanging] = useState(false)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? user?.name ?? 'Diptish Gohane',
      email: user?.email ?? 'diptish@example.com',
      phone: '',
      currency: 'INR',
      monthlySalary: 92000,
      defaultBudget: 50000,
      financialGoal: 'Become debt free and build wealth',
      notificationPreferences: 'EMI, rent, insurance, savings',
      familyMembers: 'Mummy, Tanu',
    },
  })
  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) })

  async function saveProfile(values: ProfileValues) {
    setSaving(true)
    setProfileMessage('')
    try {
      const updated = await updateProfile(values)
      setAuth({ user: { ...user, ...updated, email: values.email, fullName: values.fullName }, session, rememberMe })
      setProfileMessage('Profile updated successfully.')
    } catch {
      setProfileMessage('Could not update profile. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function savePassword(values: PasswordValues) {
    setChanging(true)
    setPasswordMessage('')
    try {
      await changePassword(values.currentPassword, values.newPassword)
      passwordForm.reset()
      setPasswordMessage('Password changed successfully.')
    } catch {
      setPasswordMessage('Could not change password. Check current password and try again.')
    } finally {
      setChanging(false)
    }
  }

  return (
    <div>
      <PageHeader title="User Profile" subtitle="Edit profile, upload photo, update preferences, and change password." icon={UserRound} />
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <GlassCard className="p-5">
          <div className="mb-6 flex items-center gap-4">
            <button className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#C6FF3D] to-[#F5C76B] text-[#111111]" aria-label="Upload profile photo"><Camera /></button>
            <div>
              <h2 className="text-2xl font-semibold text-white">{profileForm.watch('fullName')}</h2>
              <p className="text-sm text-zinc-400">{profileForm.watch('email')}</p>
            </div>
          </div>
          <form onSubmit={profileForm.handleSubmit(saveProfile)} className="grid gap-3 md:grid-cols-2">
            <input {...profileForm.register('fullName')} placeholder="Full name" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <input {...profileForm.register('email')} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <input {...profileForm.register('phone')} placeholder="Phone number" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <select {...profileForm.register('currency')} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70">
              {['INR', 'USD', 'EUR', 'GBP', 'AED'].map((code) => <option key={code}>{code}</option>)}
            </select>
            <input {...profileForm.register('monthlySalary', { valueAsNumber: true })} type="number" placeholder="Monthly salary" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <input {...profileForm.register('defaultBudget', { valueAsNumber: true })} type="number" placeholder="Default budget" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <textarea {...profileForm.register('financialGoal')} placeholder="Financial goal" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70 md:col-span-2" />
            <input {...profileForm.register('notificationPreferences')} placeholder="Notification preferences" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <input {...profileForm.register('familyMembers')} placeholder="Family members" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <button disabled={saving} className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C6FF3D] to-[#F5C76B] px-4 py-3 font-semibold text-[#111111] md:col-span-2">
              {saving && <Loader2 className="animate-spin" size={18} />}
              Save profile
            </button>
          </form>
          {profileMessage && <p className="mt-4 rounded-2xl bg-white/[0.05] p-3 text-sm text-zinc-300">{profileMessage}</p>}
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-[#C6FF3D]/12 p-3 text-[#C6FF3D]"><KeyRound /></span>
            <div>
              <h2 className="text-xl font-semibold text-white">Change password</h2>
              <p className="text-sm text-zinc-400">Update your account password securely.</p>
            </div>
          </div>
          <form onSubmit={passwordForm.handleSubmit(savePassword)} className="space-y-3">
            <input {...passwordForm.register('currentPassword')} type="password" placeholder="Current password" className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <input {...passwordForm.register('newPassword')} type="password" placeholder="New password" className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            <input {...passwordForm.register('confirmPassword')} type="password" placeholder="Confirm new password" className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" />
            {passwordForm.formState.errors.confirmPassword && <p className="text-xs text-[#FB3B5F]">{passwordForm.formState.errors.confirmPassword.message}</p>}
            <button disabled={changing} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C6FF3D]/30 bg-[#C6FF3D]/10 px-4 py-3 font-semibold text-[#C6FF3D]">
              {changing && <Loader2 className="animate-spin" size={18} />}
              Change password
            </button>
          </form>
          {passwordMessage && <p className="mt-4 rounded-2xl bg-white/[0.05] p-3 text-sm text-zinc-300">{passwordMessage}</p>}
        </GlassCard>
      </div>
    </div>
  )
}
