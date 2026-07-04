import OpenAI from 'openai'
import { Router } from 'express'
import { z } from 'zod'
import { env } from '../config/env.js'
import { ResourceService } from '../services/resourceService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const questionSchema = z.object({ question: z.string().min(3) })
export const aiRoutes = Router()

aiRoutes.post('/advice', asyncHandler(async (req, res) => {
  const { question } = questionSchema.parse(req.body)
  const loans = await new ResourceService('loans').list()
  const expenses = await new ResourceService('expenses').list()
  const debt = loans.reduce((total, loan) => total + Number(loan.outstanding_amount ?? 0), 0)
  const monthlyExpenses = expenses.reduce((total, expense) => total + Number(expense.amount ?? 0), 0) || 90000

  if (env.openaiApiKey) {
    const client = new OpenAI({ apiKey: env.openaiApiKey })
    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'You are a practical Indian personal finance advisor. Keep answers concise, numeric, and debt-aware.' },
        { role: 'user', content: `Question: ${question}\nDebt: ${debt}\nMonthly expenses: ${monthlyExpenses}` },
      ],
    })
    return res.json({ advice: completion.choices[0]?.message.content ?? 'I need more data to answer confidently.' })
  }

  const lower = question.toLowerCase()
  if (lower.includes('loan') || lower.includes('debt')) {
    const best = loans.sort((a, b) => Number(b.interest_rate ?? 0) - Number(a.interest_rate ?? 0))[0]
    return res.json({ advice: `Close ${String(best?.loan_name ?? 'the highest interest loan')} first because it has the highest effective interest. Current tracked debt is ₹${debt.toLocaleString('en-IN')}.` })
  }
  if (lower.includes('iphone') || lower.includes('buy') || lower.includes('trip')) {
    return res.json({ advice: `Not yet. Monthly pressure is about ₹${monthlyExpenses.toLocaleString('en-IN')} and debt is ₹${debt.toLocaleString('en-IN')}. Wait until the high-interest debt falls below ₹25,000.` })
  }
  return res.json({ advice: 'Save at least ₹8,200 per month toward priority goals, avoid optional purchases during July and August, and repay the highest-interest loan first.' })
}))
