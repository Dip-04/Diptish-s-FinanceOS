import { Bell, Menu, Search, UserRound } from 'lucide-react'
import { useFinanceStore } from '../../store/useFinanceStore'

export function Topbar() {
  const setSidebarOpen = useFinanceStore((state) => state.setSidebarOpen)
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050816]/72 px-4 py-4 backdrop-blur-2xl lg:pl-80">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="rounded-2xl border border-white/10 p-2 text-slate-200 lg:hidden" aria-label="Open navigation">
          <Menu size={20} />
        </button>
        <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-slate-500 md:flex">
          <Search size={18} />
          <span className="text-sm">Search transactions, loans, goals...</span>
        </div>
        <button className="ml-auto rounded-2xl border border-white/10 p-3 text-slate-300 hover:bg-white/10" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button className="rounded-2xl border border-white/10 p-3 text-slate-300 hover:bg-white/10" aria-label="Profile">
          <UserRound size={18} />
        </button>
      </div>
    </header>
  )
}
