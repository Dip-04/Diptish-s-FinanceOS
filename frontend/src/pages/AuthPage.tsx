import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Wallet } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassCard } from '../components/ui/GlassCard'
import { forgotPassword, login, register, resetPassword } from '../services/auth'
import { useAuthStore } from '../store/useAuthStore'

const authFormSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  rememberMe: z.boolean().optional(),
})

type AuthFormValues = z.infer<typeof authFormSchema>

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' | 'reset' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const isRegister = mode === 'register'
  const title = mode === 'forgot' ? 'Recover access' : mode === 'reset' ? 'Reset password' : isRegister ? 'Create your OS' : 'Welcome back'
  const cta = mode === 'forgot' ? 'Send reset link' : mode === 'reset' ? 'Update password' : isRegister ? 'Create account' : 'Login'
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  async function onSubmit(values: AuthFormValues) {
    setSubmitting(true)
    setMessage('')
    try {
      if (mode === 'forgot') {
        await forgotPassword(values.email)
        setMessage('Reset link sent if this email exists. Check your inbox.')
        return
      }

      if (mode === 'reset') {
        await resetPassword(values.email, values.password ?? '')
        setMessage('Password reset complete. You can login now.')
        setTimeout(() => navigate('/login'), 900)
        return
      }

      const payload = isRegister
        ? await register(values.fullName ?? '', values.email, values.password ?? '')
        : await login(values.email, values.password ?? '')

      setAuth({ user: payload.user, session: payload.session ?? null, rememberMe: Boolean(values.rememberMe) })
      navigate('/')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen gap-6 px-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
      <section className="aurora-card hidden overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-2xl shadow-black/40 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-3xl bg-[#111827] p-4 text-white"><Wallet size={30} /></span>
            <div>
              <p className="text-2xl font-bold text-[#111827]">Diptish Finance OS</p>
              <p className="text-sm text-gray-600">Control every rupee. Plan every dream.</p>
            </div>
          </div>
          <h1 className="mt-16 max-w-xl text-6xl font-semibold tracking-normal text-[#111827]">A calm command center for your money.</h1>
        </div>
        <div className="grid max-w-2xl grid-cols-2 gap-4">
          {['Debt pressure -32%', 'Savings runway 4.2 mo', 'Slice payoff Sep', 'AI coach ready'].map((item, index) => (
            <div key={item} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm" style={{ transform: `translateY(${index % 2 ? 20 : 0}px)` }}>
              <p className="text-sm text-gray-500">{item.split(' ')[0]}</p>
              <strong className="mt-2 block text-2xl text-[#111827]">{item.replace(item.split(' ')[0], '')}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="grid place-items-center">
      <GlassCard className="w-full max-w-md p-7">
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-2xl bg-[#111827] p-3 text-white"><Wallet size={26} /></span>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Diptish Gohane Finance OS</h1>
            <p className="text-sm text-gray-500">Control every rupee. Plan every dream.</p>
          </div>
        </div>
        <h2 className="mb-5 text-3xl font-semibold text-[#111827]">{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && <input {...formRegister('fullName')} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" placeholder="Full name" />}
          <input {...formRegister('email')} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm outline-none focus:border-[#2A9D8F]" placeholder="Email" />
          {errors.email && <p className="text-xs text-[#FB3B5F]">{errors.email.message}</p>}
          {mode !== 'forgot' && (
            <div className="flex items-center rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 focus-within:border-[#2A9D8F]">
              <input {...formRegister('password')} type={showPassword ? 'text' : 'password'} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" placeholder={mode === 'reset' ? 'New password' : 'Password'} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-zinc-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          )}
          {errors.password && <p className="text-xs text-[#FB3B5F]">{errors.password.message}</p>}
          {mode === 'login' && (
            <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-gray-600">
              <input {...formRegister('rememberMe')} type="checkbox" className="h-4 w-4 accent-[#2A9D8F]" />
              Remember me on this device
            </label>
          )}
          <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 font-semibold text-white shadow-sm disabled:opacity-70">
            {submitting && <Loader2 className="animate-spin" size={18} />}
            {cta}
          </button>
        </form>
        {message && <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm text-zinc-300">{message}</div>}
        <div className="mt-5 flex items-center justify-between text-sm text-zinc-400">
          <Link className="font-semibold text-[#2A9D8F]" to="/forgot-password">Forgot password?</Link>
          <Link className="font-semibold text-[#F5C76B]" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </div>
        <p className="mt-5 text-xs leading-5 text-zinc-500">
          Demo credentials are documented in the setup guide only. Passwords are never hardcoded into the frontend.
        </p>
      </GlassCard>
      </section>
    </main>
  )
}
