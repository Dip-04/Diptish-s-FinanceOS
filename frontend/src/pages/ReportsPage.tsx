import { FileText } from 'lucide-react'
import { ChartGrid } from '../components/charts/FinanceCharts'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'

export function ReportsPage() {
  const reports = ['Monthly income report', 'Monthly expense report', 'Daily expense report', 'Category-wise expense report', 'Savings report', 'Loan report', 'EMI report', 'Cashflow report']
  return (
    <div>
      <PageHeader title="Simple Reports" subtitle="Clear reports for income, expenses, savings, loans, EMIs, and cashflow." icon={FileText} />
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {reports.map((report) => <GlassCard key={report} className="p-4 text-sm font-semibold text-[#111827]">{report}</GlassCard>)}
      </div>
      <ChartGrid />
    </div>
  )
}
