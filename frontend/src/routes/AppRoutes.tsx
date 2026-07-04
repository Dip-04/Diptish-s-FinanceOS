import { Navigate, Route, Routes } from 'react-router-dom'
import { Bell, BriefcaseBusiness, Settings } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { AIAdvisorPage } from '../pages/AIAdvisorPage'
import { AuthPage } from '../pages/AuthPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ModulePage } from '../pages/ModulePage'
import { MonthlyPlannerPage } from '../pages/MonthlyPlannerPage'
import { ReportsPage } from '../pages/ReportsPage'
import { SimplePage } from '../pages/SimplePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="income" element={<ModulePage id="income" />} />
        <Route path="expenses" element={<ModulePage id="expenses" />} />
        <Route path="monthly-planner" element={<MonthlyPlannerPage />} />
        <Route path="loans" element={<ModulePage id="loans" />} />
        <Route path="emis" element={<ModulePage id="emis" />} />
        <Route path="credit-cards" element={<ModulePage id="credit-cards" />} />
        <Route path="goals" element={<ModulePage id="goals" />} />
        <Route path="wishlist" element={<ModulePage id="wishlist" />} />
        <Route path="investments" element={<ModulePage id="investments" />} />
        <Route path="insurance" element={<ModulePage id="insurance" />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="ai-advisor" element={<AIAdvisorPage />} />
        <Route path="documents" element={<SimplePage title="Documents Vault" subtitle="Supabase Storage-ready vault for salary slips, loan documents, insurance PDFs, statements, invoices, and tax documents." icon={BriefcaseBusiness} items={['Salary slips', 'Loan documents', 'Insurance documents', 'Bank statements', 'Bills and invoices', 'Tax documents']} />} />
        <Route path="notifications" element={<SimplePage title="Smart Notifications" subtitle="Rent due, EMI due, overspending, insurance renewal, salary credited, savings target missed, and goal achieved alerts." icon={Bell} items={['Rent due tomorrow', 'EMI due today', 'Overspending alert', 'Credit card bill due', 'Insurance renewal', 'Goal achieved']} />} />
        <Route path="settings" element={<SimplePage title="Settings" subtitle="Admin panel controls for categories, recurring expenses, notifications, backup, restore, exports, imports, and audit logs." icon={Settings} items={['Manage categories', 'Backup and restore', 'Export Excel', 'Export PDF', 'Import bank statements', 'Audit logs']} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
