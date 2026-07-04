import { NavLink } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { navItems } from '../../constants/finance'
import { useFinanceStore } from '../../store/useFinanceStore'

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useFinanceStore()
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-gray-200 bg-[#F7F4EF] p-4 pb-8 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="rounded-2xl bg-[#111827] p-3 text-white"><Wallet size={24} /></span>
          <div>
            <p className="text-lg font-bold text-[#111827]">Diptish Gohane</p>
            <p className="text-xs uppercase tracking-[0.22em] text-[#E76F51]">Finance OS</p>
          </div>
        </div>
        <nav className="space-y-1 pb-safe">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${isActive ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:bg-white/70 hover:text-[#111827]'}`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    </>
  )
}
