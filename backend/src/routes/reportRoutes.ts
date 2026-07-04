import { Router } from 'express'
import { ResourceService } from '../services/resourceService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const reportRoutes = Router()

reportRoutes.get('/summary', asyncHandler(async (_req, res) => {
  const [income, expenses, loans, investments] = await Promise.all([
    new ResourceService('income_sources').list(),
    new ResourceService('expenses').list(),
    new ResourceService('loans').list(),
    new ResourceService('investments').list(),
  ])
  const sum = (rows: Record<string, unknown>[], key = 'amount') => rows.reduce((total, row) => total + Number(row[key] ?? 0), 0)
  const debt = loans.reduce((total, row) => total + Number(row.outstanding_amount ?? 0), 0)
  const assets = sum(investments, 'current_value')
  res.json({ income: sum(income), expenses: sum(expenses), debt, assets, netWorth: assets - debt })
}))

reportRoutes.get('/monthly', (_req, res) => res.json([{ month: 'July', income: 92000, expenses: 90000, savings: 2000 }]))
reportRoutes.get('/cashflow', (_req, res) => res.json([{ month: 'July', inflow: 92000, outflow: 90000, remaining: 2000 }]))
reportRoutes.get('/net-worth', (_req, res) => res.json([{ month: 'July', assets: 315000, liabilities: 97000, netWorth: 218000 }]))
