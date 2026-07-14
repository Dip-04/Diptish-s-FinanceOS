import { Router } from 'express'
import { ResourceService } from '../services/resourceService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const reportRoutes = Router()

type Row = Record<string, unknown>
type MonthlyBucket = {
  key: string
  month: string
  monthNumber: number
  year: number
  income: number
  expenses: number
  savings: number
  debt: number
  items: Array<{ name: string; amount: number; status: string }>
}

type PlannerResponse = {
  month: string
  income: number
  carryForward: number
  availableIncome: number
  expenses: number
  remaining: number
  items: Array<{ name: string; amount: number; status: string }>
}

function asNumber(value: unknown) {
  return Number(value ?? 0)
}

function parseDateParts(value: unknown) {
  if (typeof value !== 'string') return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return { month: date.getMonth() + 1, year: date.getFullYear() }
}

function parseMonthYear(row: Row, dateField: string) {
  const fromDate = parseDateParts(row[dateField])
  if (fromDate) return fromDate

  const month = Number(row.month)
  const year = Number(row.year)
  if (!month || !year) return null
  return { month, year }
}

function monthKey(month: number, year: number) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function monthLabel(month: number, year: number) {
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

function getBucket(map: Map<string, MonthlyBucket>, month: number, year: number) {
  const key = monthKey(month, year)
  const existing = map.get(key)
  if (existing) return existing

  const created: MonthlyBucket = {
    key,
    month: monthLabel(month, year),
    monthNumber: month,
    year,
    income: 0,
    expenses: 0,
    savings: 0,
    debt: 0,
    items: [],
  }
  map.set(key, created)
  return created
}

function sortBuckets(buckets: MonthlyBucket[]) {
  return buckets.sort((a, b) => a.key.localeCompare(b.key))
}

async function loadResources() {
  const [income, expenses, loans, savings, emis] = await Promise.all([
    new ResourceService('income_sources').list(),
    new ResourceService('expenses').list(),
    new ResourceService('loans').list(),
    new ResourceService('savings_goals').list(),
    new ResourceService('emi_payments').list(),
  ])

  return { income, expenses, loans, savings, emis }
}

reportRoutes.get('/summary', asyncHandler(async (_req, res) => {
  const { income, expenses, loans, savings, emis } = await loadResources()

  const totalIncome = income.reduce((total, row) => total + asNumber(row.amount), 0)
  const totalExpenses = expenses.reduce((total, row) => total + asNumber(row.amount), 0)
  const saved = savings.reduce((total, row) => total + asNumber(row.current_saved_amount), 0)
  const debt = loans.reduce((total, row) => total + asNumber(row.outstanding_amount), 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingEmi = emis
    .filter((row) => String(row.paid_status ?? row.status ?? '').toLowerCase() !== 'paid')
    .map((row) => {
      const dueDate = typeof row.due_date === 'string' ? new Date(row.due_date) : null
      return { amount: asNumber(row.amount), dueDate }
    })
    .filter((row) => row.dueDate && !Number.isNaN(row.dueDate.getTime()) && row.dueDate >= today)
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())[0]?.amount ?? 0

  res.json({
    income: totalIncome,
    expenses: totalExpenses,
    savings: saved,
    debt,
    remaining: totalIncome - totalExpenses,
    upcomingEmi,
  })
}))

reportRoutes.get('/monthly', asyncHandler(async (_req, res) => {
  const { income, expenses, loans, savings } = await loadResources()
  const buckets = new Map<string, MonthlyBucket>()

  for (const row of income) {
    const parts = parseMonthYear(row, 'received_date')
    if (!parts) continue
    const bucket = getBucket(buckets, parts.month, parts.year)
    bucket.income += asNumber(row.amount)
  }

  for (const row of expenses) {
    const parts = parseMonthYear(row, 'due_date')
    if (!parts) continue
    const bucket = getBucket(buckets, parts.month, parts.year)
    bucket.expenses += asNumber(row.amount)
    bucket.items.push({
      name: String(row.expense_name ?? row.category ?? 'Expense'),
      amount: asNumber(row.amount),
      status: String(row.status ?? 'Planned'),
    })
  }

  for (const row of loans) {
    const parts = parseMonthYear(row, 'start_date')
    if (!parts) continue
    const bucket = getBucket(buckets, parts.month, parts.year)
    bucket.debt += asNumber(row.outstanding_amount)
  }

  for (const row of savings) {
    const parts = parseMonthYear(row, 'deadline')
    if (!parts) continue
    const bucket = getBucket(buckets, parts.month, parts.year)
    bucket.savings += asNumber(row.current_saved_amount)
  }

  const monthly = sortBuckets([...buckets.values()]).map((bucket) => ({
    month: bucket.month,
    income: bucket.income,
    expenses: bucket.expenses,
    savings: bucket.savings,
    debt: bucket.debt,
    remaining: bucket.income - bucket.expenses,
    items: bucket.items.sort((a, b) => b.amount - a.amount),
  }))

  res.json(monthly)
}))

reportRoutes.get('/cashflow', asyncHandler(async (_req, res) => {
  const { income, expenses, loans, savings } = await loadResources()
  const buckets = new Map<string, MonthlyBucket>()

  for (const row of income) {
    const parts = parseMonthYear(row, 'received_date')
    if (!parts) continue
    getBucket(buckets, parts.month, parts.year).income += asNumber(row.amount)
  }

  for (const row of expenses) {
    const parts = parseMonthYear(row, 'due_date')
    if (!parts) continue
    getBucket(buckets, parts.month, parts.year).expenses += asNumber(row.amount)
  }

  for (const row of loans) {
    const parts = parseMonthYear(row, 'start_date')
    if (!parts) continue
    getBucket(buckets, parts.month, parts.year).debt += asNumber(row.outstanding_amount)
  }

  for (const row of savings) {
    const parts = parseMonthYear(row, 'deadline')
    if (!parts) continue
    getBucket(buckets, parts.month, parts.year).savings += asNumber(row.current_saved_amount)
  }

  res.json(
    sortBuckets([...buckets.values()]).map((bucket) => ({
      name: bucket.month,
      income: bucket.income,
      expenses: bucket.expenses,
      savings: bucket.savings,
      debt: bucket.debt,
      remaining: bucket.income - bucket.expenses,
    })),
  )
}))

reportRoutes.get('/categories', asyncHandler(async (_req, res) => {
  const { expenses } = await loadResources()
  const grouped = new Map<string, number>()

  for (const row of expenses) {
    const name = String(row.category ?? 'Other')
    grouped.set(name, (grouped.get(name) ?? 0) + asNumber(row.amount))
  }

  res.json(
    [...grouped.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
  )
}))

reportRoutes.get('/planner', asyncHandler(async (_req, res) => {
  const { income, expenses } = await loadResources()
  const buckets = new Map<string, MonthlyBucket>()

  for (const row of income) {
    const parts = parseMonthYear(row, 'received_date')
    if (!parts) continue
    getBucket(buckets, parts.month, parts.year).income += asNumber(row.amount)
  }

  for (const row of expenses) {
    const parts = parseMonthYear(row, 'due_date')
    if (!parts) continue
    const bucket = getBucket(buckets, parts.month, parts.year)
    bucket.expenses += asNumber(row.amount)
    bucket.items.push({
      name: String(row.expense_name ?? row.category ?? 'Expense'),
      amount: asNumber(row.amount),
      status: String(row.status ?? 'Planned'),
    })
  }

  const ordered = sortBuckets([...buckets.values()])
  let carryForward = 0

  const planner: PlannerResponse[] = ordered.map((bucket) => {
    const availableIncome = bucket.income + carryForward
    const remaining = availableIncome - bucket.expenses
    const response = {
      month: bucket.month,
      income: bucket.income,
      carryForward,
      availableIncome,
      expenses: bucket.expenses,
      remaining,
      items: bucket.items.sort((a, b) => b.amount - a.amount),
    }
    carryForward = remaining
    return response
  })

  res.json(planner.reverse())
}))
