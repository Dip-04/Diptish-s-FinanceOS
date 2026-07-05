import { Router } from 'express'
import { ResourceService } from '../services/resourceService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const reportRoutes = Router()

reportRoutes.get('/summary', asyncHandler(async (_req, res) => {
  const [income, expenses, loans, savings] = await Promise.all([
    new ResourceService('income_sources').list(),
    new ResourceService('expenses').list(),
    new ResourceService('loans').list(),
    new ResourceService('savings_goals').list(),
  ])
  const sum = (rows: Record<string, unknown>[], key = 'amount') => rows.reduce((total, row) => total + Number(row[key] ?? 0), 0)
  const debt = loans.reduce((total, row) => total + Number(row.outstanding_amount ?? 0), 0)
  const totalIncome = sum(income)
  const totalExpenses = sum(expenses)
  const saved = sum(savings, 'current_saved_amount')
  res.json({ income: totalIncome, expenses: totalExpenses, savings: saved, debt, remaining: totalIncome - totalExpenses })
}))

reportRoutes.get('/monthly', (_req, res) => res.json([{ month: 'July', income: 93400, expenses: 81000, savings: 12400 }]))
reportRoutes.get('/cashflow', (_req, res) => res.json([{ month: 'July', inflow: 93400, outflow: 81000, remaining: 12400 }]))
