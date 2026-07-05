import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { AuthPage } from '../pages/AuthPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ModulePage } from '../pages/ModulePage'
import { MonthlyPlannerPage } from '../pages/MonthlyPlannerPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ReportsPage } from '../pages/ReportsPage'
import { useAuthStore } from '../store/useAuthStore'

function ProtectedApp() {
  const user = useAuthStore((state) => state.user)
  return user ? <AppLayout /> : <Navigate to="/login" replace />
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  return user ? <Navigate to="/" replace /> : children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><AuthPage mode="login" /></PublicOnly>} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<PublicOnly><AuthPage mode="forgot" /></PublicOnly>} />
      <Route path="/reset-password" element={<PublicOnly><AuthPage mode="reset" /></PublicOnly>} />
      <Route element={<ProtectedApp />}>
        <Route index element={<DashboardPage />} />
        <Route path="income" element={<ModulePage id="income" />} />
        <Route path="monthly-expenses" element={<ModulePage id="monthly-expenses" />} />
        <Route path="daily-expenses" element={<ModulePage id="daily-expenses" />} />
        <Route path="expenses" element={<ModulePage id="expenses" />} />
        <Route path="monthly-planner" element={<MonthlyPlannerPage />} />
        <Route path="loans" element={<ModulePage id="loans" />} />
        <Route path="emis" element={<ModulePage id="emis" />} />
        <Route path="savings" element={<ModulePage id="savings" />} />
        <Route path="purchases" element={<ModulePage id="purchases" />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
