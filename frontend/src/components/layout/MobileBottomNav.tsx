import { NavLink } from 'react-router-dom'
import { Banknote, CalendarDays, Gauge, Plus, ReceiptText, Target } from 'lucide-react'

const mobileItems = [
  { label: 'Home', path: '/', icon: Gauge },
  { label: 'Spend', path: '/expenses', icon: ReceiptText },
  { label: 'Add', path: '/daily-expenses', icon: Plus, primary: true },
  { label: 'Plan', path: '/monthly-planner', icon: CalendarDays },
  { label: 'Save', path: '/savings', icon: Target },
]

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[1.6rem] border border-gray-200 bg-white p-2 shadow-[0_18px_45px_rgba(17,24,39,0.14)] lg:hidden" style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      {mobileItems.map((item) => (
        <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] transition ${item.primary ? 'bg-[#111827] text-white' : isActive ? 'bg-[#F1F5F9] text-[#E76F51]' : 'text-gray-500'}`}>
          <item.icon size={item.primary ? 21 : 18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function FloatingActionButton() {
  return (
    <NavLink to="/income" className="fixed right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#111827] text-white shadow-[0_16px_34px_rgba(17,24,39,0.22)] lg:hidden" style={{ bottom: 'calc(max(0.75rem, env(safe-area-inset-bottom)) + 5.4rem)' }} aria-label="Add income">
      <Banknote size={24} />
    </NavLink>
  )
}
