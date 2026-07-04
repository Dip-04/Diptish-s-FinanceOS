import { Router } from 'express'
import { z } from 'zod'
import { ResourceService } from '../services/resourceService.js'
import type { ResourceName } from '../types/finance.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const ocrRoutes = Router()
export const reminderRoutes = Router()
export const voiceRoutes = Router()
export const familyRoutes = Router()
export const plannerRoutes = Router()
export const currencyRoutes = Router()
export const syncRoutes = Router()

ocrRoutes.post('/upload', asyncHandler(async (req, res) => {
  const record = await new ResourceService('ocr_transactions').create({
    source_file: req.body.fileName ?? 'mock-statement.pdf',
    status: 'review',
    extracted_transactions: [
      { type: 'debit', amount: 500, merchant: 'Petrol Pump', category: 'Petrol' },
      { type: 'credit', amount: 92000, merchant: 'Salary', category: 'Income' },
    ],
  })
  res.status(201).json(record)
}))
ocrRoutes.get('/transactions', asyncHandler(async (_req, res) => res.json(await new ResourceService('ocr_transactions').list())))
ocrRoutes.post('/transactions/:id/confirm', asyncHandler(async (req, res) => res.json(await new ResourceService('ocr_transactions').update(String(req.params.id), { status: 'confirmed' }))))

reminderRoutes.get('/', asyncHandler(async (_req, res) => res.json(await new ResourceService('reminders').list())))
reminderRoutes.post('/', asyncHandler(async (req, res) => res.status(201).json(await new ResourceService('reminders').create(req.body))))
reminderRoutes.post('/send-whatsapp', asyncHandler(async (req, res) => res.json({ ok: true, provider: 'placeholder', reminder: req.body, message: 'Configure a WhatsApp provider key on the backend to send real messages.' })))

voiceRoutes.post('/process', asyncHandler(async (req, res) => {
  const { command } = z.object({ command: z.string().min(2) }).parse(req.body)
  const amount = Number(command.match(/[\d,]+/)?.[0]?.replace(/,/g, '') ?? 0)
  const category = /petrol/i.test(command) ? 'Petrol' : /food/i.test(command) ? 'Food' : 'Other'
  const record = await new ResourceService('voice_commands').create({ command, parsed: { amount, category }, status: 'review' })
  res.status(201).json(record)
}))

familyRoutes.use('/groups', resourceSubrouter('family_groups'))
familyRoutes.use('/members', resourceSubrouter('family_members'))
familyRoutes.use('/budgets', resourceSubrouter('shared_budgets'))

plannerRoutes.post('/tax', (_req, res) => res.json({ taxableIncome: 880000, suggestions: ['Fill 80C gap', 'Review HRA eligibility', 'Track insurance deduction'] }))
plannerRoutes.post('/investments', (_req, res) => res.json({ riskProfile: 'Balanced', monthlySip: 8200, allocation: { mutualFunds: 60, fdCash: 25, gold: 15 }, disclaimer: 'This is educational guidance, not financial advice.' }))
plannerRoutes.post('/coach', (_req, res) => res.json({ debtPressure: 'High', savingsScore: 42, nextHabit: 'Avoid new purchases until September' }))

currencyRoutes.get('/', (_req, res) => res.json(['INR', 'USD', 'EUR', 'GBP', 'AED']))
currencyRoutes.put('/preference', asyncHandler(async (req, res) => res.json(await new ResourceService('currencies').create({ preferred_currency: req.body.currency ?? 'INR' }))))

syncRoutes.get('/queue', asyncHandler(async (_req, res) => res.json(await new ResourceService('sync_queue').list())))
syncRoutes.post('/queue', asyncHandler(async (req, res) => res.status(201).json(await new ResourceService('sync_queue').create(req.body))))
syncRoutes.post('/flush', asyncHandler(async (_req, res) => res.json({ ok: true, strategy: 'idempotent updated_at conflict-safe merge' })))

function resourceSubrouter(resource: ResourceName) {
  const router = Router()
  const service = new ResourceService(resource)
  router.get('/', asyncHandler(async (_req, res) => res.json(await service.list())))
  router.post('/', asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body))))
  router.put('/:id', asyncHandler(async (req, res) => res.json(await service.update(String(req.params.id), req.body))))
  router.delete('/:id', asyncHandler(async (req, res) => res.json(await service.remove(String(req.params.id)))))
  return router
}
