import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Search, UserRound } from 'lucide-react'
import { useFinanceStore } from '../../store/useFinanceStore'
import { getErrorMessage } from '../../services/api'
import { logout } from '../../services/auth'
import { useAuthStore } from '../../store/useAuthStore'
import { useToastStore } from '../../store/useToastStore'

export function Topbar() {
  const navigate = useNavigate()
  const setSidebarOpen = useFinanceStore((state) => state.setSidebarOpen)
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const showToast = useToastStore((state) => state.showToast)

  async function handleLogout() {
    try {
      await logout()
      showToast({ type: 'success', title: 'Logged out', message: 'You have been signed out successfully.' })
    } catch (error) {
      showToast({ type: 'warning', title: 'Logged out locally', message: getErrorMessage(error, 'Server logout failed, but your local session was cleared.') })
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-[#F7F4EF]/95 px-4 py-4 lg:pl-80">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="rounded-2xl border border-gray-200 bg-white p-2 text-[#111827] lg:hidden" aria-label="Open navigation">
          <Menu size={20} />
        </button>
        <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-500 md:flex">
          <Search size={18} />
          <span className="text-sm">Search income, expenses, loans, and payments...</span>
        </div>
        <button className="ml-auto rounded-2xl border border-gray-200 bg-white p-3 text-gray-600 hover:bg-[#F9FAFB]" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <Link to="/profile" className="hidden items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-[#F9FAFB] sm:flex" aria-label="Profile">
          <UserRound size={18} />
          <span className="max-w-28 truncate">{user?.fullName ?? user?.name ?? user?.email ?? 'Profile'}</span>
        </Link>
        <Link to="/profile" className="rounded-2xl border border-gray-200 bg-white p-3 text-gray-700 hover:bg-[#F9FAFB] sm:hidden" aria-label="Profile">
          <UserRound size={18} />
        </Link>
        <button onClick={handleLogout} className="rounded-2xl border border-gray-200 bg-white p-3 text-gray-700 hover:bg-[#F9FAFB]" aria-label="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
