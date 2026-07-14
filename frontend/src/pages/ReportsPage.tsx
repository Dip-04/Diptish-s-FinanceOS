import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { ChartGrid } from '../components/charts/FinanceCharts'
import { GlassCard } from '../components/ui/GlassCard'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { getErrorMessage } from '../services/api'
import { getCashflowReport, getCategoryReport, getReportSummary } from '../services/reports'
import { useToastStore } from '../store/useToastStore'
import type { CategoryPoint, MoneyPoint, ReportSummary } from '../types/finance'
import { currency } from '../utils/format'

const reportCards = [
  { label: 'Total income', key: 'income' },
  { label: 'Total expenses', key: 'expenses' },
  { label: 'Total savings', key: 'savings' },
  { label: 'Total debt', key: 'debt' },
  { label: 'Remaining balance', key: 'remaining' },
] as const

export function ReportsPage() {
  const showToast = useToastStore((state) => state.showToast)
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [cashflow, setCashflow] = useState<MoneyPoint[]>([])
  const [categories, setCategories] = useState<CategoryPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadReports() {
      setIsLoading(true)
      try {
        const [summaryData, cashflowData, categoryData] = await Promise.all([
          getReportSummary(),
          getCashflowReport(),
          getCategoryReport(),
        ])

        if (!active) return
        setSummary(summaryData)
        setCashflow(cashflowData)
        setCategories(categoryData)
      } catch (error) {
        if (!active) return
        showToast({ type: 'warning', title: 'Could not load reports', message: getErrorMessage(error, 'We could not load reports from the API.') })
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadReports()

    return () => {
      active = false
    }
  }, [showToast])

  return (
    <div>
      <PageHeader title="Simple Reports" subtitle="Clear reports for income, expenses, savings, loans, EMIs, and cashflow." icon={FileText} />
      {isLoading ? (
        <GlassCard className="p-6">
          <LoadingState title="Loading reports..." />
        </GlassCard>
      ) : (
        <>
          <div className="mb-5 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
            {reportCards.map((report) => <GlassCard key={report.key} className="p-4 text-sm font-semibold text-[#111827]">{report.label}: {currency(Number(summary?.[report.key] ?? 0))}</GlassCard>)}
          </div>
          <ChartGrid cashflow={cashflow} categories={categories} />
        </>
      )}
    </div>
  )
}
