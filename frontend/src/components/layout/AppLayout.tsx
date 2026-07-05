import { Outlet } from 'react-router-dom'
import { FloatingActionButton, MobileBottomNav } from './MobileBottomNav'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="px-4 pb-28 pt-6 lg:pb-8 lg:pl-80">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
      <FloatingActionButton />
      <MobileBottomNav />
    </div>
  )
}
