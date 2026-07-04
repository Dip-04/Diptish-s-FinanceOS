import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { aiRoutes } from './routes/aiRoutes.js'
import { authRoutes } from './routes/authRoutes.js'
import { crudRoutes } from './routes/crudRoutes.js'
import { documentRoutes } from './routes/documentRoutes.js'
import { reportRoutes } from './routes/reportRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ ok: true, service: "Diptish's Finance OS API" }))
app.use('/api/auth', authRoutes)
app.use('/api/income', crudRoutes('income_sources'))
app.use('/api/expenses', crudRoutes('expenses'))
app.use('/api/monthly-plans', crudRoutes('monthly_plans'))
app.use('/api/loans', crudRoutes('loans'))
app.use('/api/emis', crudRoutes('emi_payments'))
app.use('/api/credit-cards', crudRoutes('credit_cards'))
app.use('/api/goals', crudRoutes('savings_goals'))
app.use('/api/wishlist', crudRoutes('wishlist_items'))
app.use('/api/investments', crudRoutes('investments'))
app.use('/api/insurance', crudRoutes('insurance_policies'))
app.use('/api/reports', reportRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/notifications', crudRoutes('notifications'))
app.use(errorHandler)
