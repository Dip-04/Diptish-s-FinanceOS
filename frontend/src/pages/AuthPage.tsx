import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Wallet } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' | 'reset' }) {
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const isRegister = mode === 'register'
  const title = mode === 'forgot' ? 'Recover access' : mode === 'reset' ? 'Reset password' : isRegister ? 'Create your OS' : 'Welcome back'
  const cta = mode === 'forgot' ? 'Send reset link' : mode === 'reset' ? 'Update password' : isRegister ? 'Create account' : 'Login'

  return (
    <main className="grid min-h-screen gap-6 px-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
      <section className="aurora-card hidden overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-2xl shadow-black/40 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-3xl bg-[#C6FF3D] p-4 text-[#111111]"><Wallet size={30} /></span>
            <div>
              <p className="text-2xl font-bold text-white">Diptish Finance OS</p>
              <p className="text-sm text-zinc-300">Control every rupee. Plan every dream.</p>
            </div>
          </div>
          <h1 className="mt-16 max-w-xl text-6xl font-semibold tracking-normal text-white">A luxury command center for your money.</h1>
        </div>
        <div className="grid max-w-2xl grid-cols-2 gap-4">
          {['Debt pressure -32%', 'Savings runway 4.2 mo', 'Slice payoff Sep', 'AI coach ready'].map((item, index) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl" style={{ transform: `translateY(${index % 2 ? 20 : 0}px)` }}>
              <p className="text-sm text-zinc-400">{item.split(' ')[0]}</p>
              <strong className="mt-2 block text-2xl text-white">{item.replace(item.split(' ')[0], '')}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="grid place-items-center">
      <GlassCard className="w-full max-w-md p-7">
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-2xl bg-gradient-to-br from-[#C6FF3D] via-[#F5C76B] to-[#FF6B6B] p-3 text-[#111111]"><Wallet size={26} /></span>
          <div>
            <h1 className="text-2xl font-bold text-white">Diptish Gohane Finance OS</h1>
            <p className="text-sm text-zinc-400">Control every rupee. Plan every dream.</p>
          </div>
        </div>
        <h2 className="mb-5 text-3xl font-semibold text-white">{title}</h2>
        <form className="space-y-4">
          {isRegister && <input className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" placeholder="Full name" />}
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-[#C6FF3D]/70" placeholder="Email" />
          {mode !== 'forgot' && (
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 focus-within:border-[#C6FF3D]/70">
              <input type={showPassword ? 'text' : 'password'} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" placeholder={mode === 'reset' ? 'New password' : 'Password'} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-zinc-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          )}
          <button className="w-full rounded-2xl bg-gradient-to-r from-[#C6FF3D] to-[#F5C76B] px-4 py-3 font-semibold text-[#111111] shadow-lg shadow-lime-500/20">
            {cta}
          </button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm text-zinc-400">
          <Link className="font-semibold text-[#C6FF3D]" to="/forgot-password">Forgot password?</Link>
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
