import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type MoneyPoint = { name: string; income?: number; expenses?: number; savings?: number; debt?: number; netWorth?: number }
export type CategoryPoint = { name: string; value: number }
export type ReportSummary = { income: number; expenses: number; savings: number; debt: number; remaining: number; upcomingEmi: number }
export type PlannerItem = { name: string; amount: number; status: string }
export type PlannerMonth = { month: string; income: number; carryForward?: number; availableIncome?: number; expenses: number; savings?: number; debt?: number; remaining: number; items: PlannerItem[] }
export type KeyValue = { label: string; value: string | number }
export type TableColumn<T> = { key: keyof T | string; header: string; render?: (row: T) => ReactNode }
export type ModuleField = { name: string; label: string; type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox'; options?: string[] }
export type ModuleConfig<T extends Record<string, unknown>> = {
  title: string
  subtitle: string
  endpoint: string
  icon: LucideIcon
  accent: string
  fields: ModuleField[]
  columns: TableColumn<T>[]
  seed: T[]
}
export type NavItem = { label: string; path: string; icon: LucideIcon }
export type FinanceRecord = Record<string, string | number | boolean | null | undefined>
