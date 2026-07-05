import { useState } from 'react'
import { Camera, KeyRound, Loader2, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'
import { getErrorMessage } from '../services/api'
import { changePassword, updateProfile } from '../services/auth'
import { useAuthStore } from '../store/useAuthStore'
import { useToastStore } from '../store/useToastStore'

const profileSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  monthlySalary: z.number().min(0),
  defaultBudget: z.number().min(0),
  financialGoal: z.string().optional(),
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
  const showToast = useToastStore((state) => state.showToast)
  const [saving, setSaving] = useState(false)
  const [changing, setChanging] = useState(false)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? user?.name ?? 'Diptish Gohane',
      email: user?.email ?? 'diptish@example.com',
      phone: '',
      monthlySalary: 92000,
      defaultBudget: 50000,
      financialGoal: 'Become debt free and build wealth',
    },
  })
  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) })

  async function saveProfile(values: ProfileValues) {
    setSaving(true)
    try {
      const updated = await updateProfile({ id: user?.id, ...values })
      setAuth({ user: { ...user, ...updated, email: values.email, fullName: values.fullName }, session, rememberMe })
      showToast({ type: 'success', title: 'Profile saved', message: 'Your profile details were updated successfully.' })
    } catch (error) {
      showToast({ type: 'error', title: 'Could not save profile', message: getErrorMessage(error, 'Please review your details and try again.') })
    } finally {
      setSaving(false)
    }
  }

  async function savePassword(values: PasswordValues) {
    setChanging(true)
    try {
      await changePassword(values.currentPassword, values.newPassword)
      passwordForm.reset()
      showToast({ type: 'success', title: 'Password changed', message: 'Use your new password the next time you login.' })
    } catch (error) {
      showToast({ type: 'error', title: 'Could not change password', message: getErrorMessage(error, 'Check your current password and try again.') })
    } finally {
      setChanging(false)
    }
  }

  return (
    <div>
      <PageHeader title="User Profile" subtitle="Edit your basic account details and change password." icon={UserRound} />
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <GlassCard className="p-5">
          <div className="mb-6 flex items-center gap-4">
            <button className="grid h-20 w-20 place-items-center rounded-3xl bg-[#111827] text-white" aria-label="Upload profile photo"><Camera /></button>
            <div>
              <h2 className="text-2xl font-semibold text-[#111827]">{profileForm.watch('fullName')}</h2>
              <p className="text-sm text-gray-500">{profileForm.watch('email')}</p>
            </div>
          </div>
          <form onSubmit={profileForm.handleSubmit(saveProfile)} className="grid gap-3 md:grid-cols-2">
            <input {...profileForm.register('fullName')} placeholder="Full name" className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            <input {...profileForm.register('email')} placeholder="Email" className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            <input {...profileForm.register('phone')} placeholder="Phone number" className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            <input {...profileForm.register('monthlySalary', { valueAsNumber: true })} type="number" placeholder="Monthly salary" className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            <input {...profileForm.register('defaultBudget', { valueAsNumber: true })} type="number" placeholder="Default budget" className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            <textarea {...profileForm.register('financialGoal')} placeholder="Financial goal" className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F] md:col-span-2" />
            <button disabled={saving} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 font-semibold text-white md:col-span-2">
              {saving && <Loader2 className="animate-spin" size={18} />}
              Save profile
            </button>
          </form>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-[#F1F5F9] p-3 text-[#E76F51]"><KeyRound /></span>
            <div>
              <h2 className="text-xl font-semibold text-[#111827]">Change password</h2>
              <p className="text-sm text-gray-500">Update your account password securely.</p>
            </div>
          </div>
          <form onSubmit={passwordForm.handleSubmit(savePassword)} className="space-y-3">
            <input {...passwordForm.register('currentPassword')} type="password" placeholder="Current password" className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            <input {...passwordForm.register('newPassword')} type="password" placeholder="New password" className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            <input {...passwordForm.register('confirmPassword')} type="password" placeholder="Confirm new password" className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" />
            {passwordForm.formState.errors.confirmPassword && <p className="text-xs text-[#FB3B5F]">{passwordForm.formState.errors.confirmPassword.message}</p>}
            <button disabled={changing} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#2A9D8F]/30 bg-[#2A9D8F]/10 px-4 py-3 font-semibold text-[#2A9D8F]">
              {changing && <Loader2 className="animate-spin" size={18} />}
              Change password
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
