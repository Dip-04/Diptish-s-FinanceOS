import { NavLink } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { navItems } from '../../constants/finance'
import { useFinanceStore } from '../../store/useFinanceStore'

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useFinanceStore()
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[#050816]/90 p-4 backdrop-blur-2xl transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 p-3 text-slate-950"><Wallet size={24} /></span>
          <div>
            <p className="text-lg font-bold text-slate-50">Diptish's</p>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Finance OS</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${isActive ? 'bg-cyan-300/12 text-cyan-100 shadow-lg shadow-cyan-500/10' : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'}`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    </>
  )
}
