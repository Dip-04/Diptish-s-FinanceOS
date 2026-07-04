import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('diptish@example.com')
  const isRegister = mode === 'register'

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <GlassCard className="w-full max-w-md p-7">
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 p-3 text-slate-950"><Wallet size={26} /></span>
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Diptish's Finance OS</h1>
            <p className="text-sm text-slate-400">Your personal financial operating system</p>
          </div>
        </div>
        <form className="space-y-4">
          {isRegister && <input className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-cyan-300/70" placeholder="Full name" />}
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-cyan-300/70" placeholder="Email" />
          <input type="password" className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none focus:border-cyan-300/70" placeholder="Password" />
          <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">
            {isRegister ? 'Create account' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <Link className="font-semibold text-cyan-200" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </GlassCard>
    </main>
  )
}
