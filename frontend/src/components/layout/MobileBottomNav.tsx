import { NavLink } from 'react-router-dom'
import { Bot, Gauge, Plus, ReceiptText, Target, WalletCards } from 'lucide-react'

const mobileItems = [
  { label: 'Home', path: '/', icon: Gauge },
  { label: 'Spend', path: '/expenses', icon: ReceiptText },
  { label: 'Add', path: '/voice-entry', icon: Plus, primary: true },
  { label: 'Goals', path: '/goals', icon: Target },
  { label: 'AI', path: '/ai-advisor', icon: Bot },
]

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[1.6rem] border border-white/10 bg-[#111318]/88 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl lg:hidden" style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      {mobileItems.map((item) => (
        <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] transition ${item.primary ? 'bg-[#C6FF3D] text-[#111111]' : isActive ? 'bg-white/10 text-[#C6FF3D]' : 'text-zinc-400'}`}>
          <item.icon size={item.primary ? 21 : 18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function FloatingActionButton() {
  return (
    <NavLink to="/voice-entry" className="fixed right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#C6FF3D] to-[#F5C76B] text-[#111111] shadow-2xl shadow-lime-500/25 lg:hidden" style={{ bottom: 'calc(max(0.75rem, env(safe-area-inset-bottom)) + 5.4rem)' }} aria-label="Quick add">
      <WalletCards size={24} />
    </NavLink>
  )
}
