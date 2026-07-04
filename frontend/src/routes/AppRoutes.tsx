import { Navigate, Route, Routes } from 'react-router-dom'
import { BadgeIndianRupee, Banknote, Bell, Bot, BriefcaseBusiness, ChartNoAxesCombined, Landmark, MessageCircle, Moon, PiggyBank, Settings, ShieldCheck, Sparkles, Target, Users, WalletCards, Wifi } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { AIAdvisorPage } from '../pages/AIAdvisorPage'
import { AdvancedPage } from '../pages/AdvancedPage'
import { AuthPage } from '../pages/AuthPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ModulePage } from '../pages/ModulePage'
import { MonthlyPlannerPage } from '../pages/MonthlyPlannerPage'
import { OCRPage } from '../pages/OCRPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ReportsPage } from '../pages/ReportsPage'
import { SimplePage } from '../pages/SimplePage'
import { VoiceEntryPage } from '../pages/VoiceEntryPage'
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
        <Route path="ai-tax-planner" element={<AdvancedPage title="AI Tax Planner" subtitle="Plan taxable income, deductions, HRA, 80C, insurance, loan interest, and tax-saving opportunities." icon={Landmark} cards={[
          { title: 'Taxable income', value: '₹8.8L', detail: 'Projected from income and recurring deductions.', icon: Banknote },
          { title: '80C planner', value: '₹62K gap', detail: 'PPF, ELSS, insurance, and principal repayment opportunities.', icon: ShieldCheck },
          { title: 'HRA optimizer', value: 'Review rent', detail: 'Rent data exists; add landlord and city details for better estimate.', icon: BadgeIndianRupee },
        ]} />} />
        <Route path="ai-investments" element={<AdvancedPage title="AI Investment Recommendations" subtitle="Risk profile, monthly investable amount, emergency fund check, SIP planning, FD/gold/stocks/category allocation." icon={ChartNoAxesCombined} disclaimer="This is educational guidance, not financial advice." cards={[
          { title: 'Risk profile', value: 'Balanced', detail: 'Debt pressure suggests conservative allocation until September.', icon: Target },
          { title: 'SIP plan', value: '₹8,200/mo', detail: 'Start after Slice principal drops under the comfort threshold.', icon: PiggyBank },
          { title: 'Allocation', value: '60/25/15', detail: 'Mutual funds, FD/cash, gold after emergency fund is stable.', icon: ChartNoAxesCombined },
        ]} />} />
        <Route path="ai-coach" element={<AdvancedPage title="AI Monthly Financial Coach" subtitle="Monthly summary, overspending alerts, debt pressure, savings score, goal progress, and next-month habits." icon={Sparkles} cards={[
          { title: 'Debt pressure', value: 'High in July', detail: 'Avoid new large purchases until September.', icon: WalletCards },
          { title: 'Savings score', value: '42/100', detail: 'August has zero savings; September recovers runway.', icon: PiggyBank },
          { title: 'Next habit', value: 'Confirm spends', detail: 'Review every OCR/UPI transaction before saving.', icon: Bot },
        ]} />} />
        <Route path="documents" element={<SimplePage title="Documents Vault" subtitle="Supabase Storage-ready vault for salary slips, loan documents, insurance PDFs, statements, invoices, and tax documents." icon={BriefcaseBusiness} items={['Salary slips', 'Loan documents', 'Insurance documents', 'Bank statements', 'Bills and invoices', 'Tax documents']} />} />
        <Route path="ocr" element={<OCRPage />} />
        <Route path="upi-sms" element={<AdvancedPage title="UPI SMS Auto Detection" subtitle="Web API and UI structure for future mobile permission-based SMS parsing. Actual SMS reading requires a mobile app permission." icon={MessageCircle} cards={[
          { title: 'Debit detector', value: 'Ready', detail: 'Extracts amount, merchant, bank, and category from UPI debit messages.', icon: MessageCircle },
          { title: 'Credit detector', value: 'Ready', detail: 'Salary, refunds, and incoming UPI credits can be confirmed as income.', icon: Banknote },
          { title: 'Confirmation', value: 'Required', detail: 'Transactions are queued for user confirmation before saving.', icon: Target },
        ]} />} />
        <Route path="whatsapp-reminders" element={<AdvancedPage title="WhatsApp Reminders" subtitle="Placeholder provider integration for EMI, rent, credit card, loan, insurance, savings, and monthly summary reminders." icon={Bell} cards={[
          { title: 'EMI reminders', value: 'Scheduled', detail: 'Slice EMI and bike EMI reminder templates are ready.', icon: WalletCards },
          { title: 'Provider', value: 'Env-based', detail: 'No WhatsApp API key is hardcoded; backend expects provider env keys later.', icon: MessageCircle },
          { title: 'Summary', value: 'Monthly', detail: 'Coach summary can be sent when the provider is configured.', icon: Sparkles },
        ]} />} />
        <Route path="voice-entry" element={<VoiceEntryPage />} />
        <Route path="family-budget" element={<AdvancedPage title="Family Shared Budgets" subtitle="Create groups, invite members, set roles, shared expenses, shared goals, family budget, and member-wise spending." icon={Users} cards={[
          { title: 'Family group', value: 'Diptish Home', detail: 'Owner/editor/viewer role model is ready.', icon: Users },
          { title: 'Shared budget', value: '₹40,000', detail: 'Mummy/Tanu style family planning can be tracked separately.', icon: PiggyBank },
          { title: 'Member spend', value: 'Role-based', detail: 'Shared expenses and goals are permission-aware in schema/API.', icon: ShieldCheck },
        ]} />} />
        <Route path="multi-currency" element={<AdvancedPage title="Multi-Currency Support" subtitle="Currency preference and formatting structure for INR, USD, EUR, GBP, and AED." icon={Wifi} cards={[
          { title: 'Default', value: 'INR', detail: 'Profile preference controls money formatting across the app.', icon: BadgeIndianRupee },
          { title: 'Supported', value: '5 currencies', detail: 'INR, USD, EUR, GBP, and AED.', icon: Wifi },
          { title: 'Reports', value: 'Ready', detail: 'Currency settings can be used by report and export services.', icon: ChartNoAxesCombined },
        ]} />} />
        <Route path="offline-sync" element={<AdvancedPage title="Offline Mode with Sync" subtitle="PWA-ready local queue structure for offline expenses, online sync, sync status, and conflict-safe updates." icon={Moon} cards={[
          { title: 'Queue', value: 'Local', detail: 'Offline writes are queued and can sync when the browser is online.', icon: Moon },
          { title: 'Conflict model', value: 'Updated-at', detail: 'Uses timestamps and idempotent IDs for safer sync merges.', icon: ShieldCheck },
          { title: 'PWA', value: 'Ready', detail: 'Manifest and service worker shell support are included.', icon: Sparkles },
        ]} />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SimplePage title="Settings" subtitle="Admin panel controls for categories, recurring expenses, notifications, backup, restore, exports, imports, and audit logs." icon={Settings} items={['Manage categories', 'Backup and restore', 'Export Excel', 'Export PDF', 'Import bank statements', 'Audit logs']} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
