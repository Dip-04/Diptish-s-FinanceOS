import { api } from './api'
import type { CategoryPoint, MoneyPoint, PlannerMonth, ReportSummary } from '../types/finance'

export async function getReportSummary() {
  const { data } = await api.get<ReportSummary>('/reports/summary')
  return data
}

export async function getCashflowReport() {
  const { data } = await api.get<MoneyPoint[]>('/reports/cashflow')
  return data
}

export async function getCategoryReport() {
  const { data } = await api.get<CategoryPoint[]>('/reports/categories')
  return data
}

export async function getPlannerReport() {
  const { data } = await api.get<PlannerMonth[]>('/reports/planner')
  return data
}
