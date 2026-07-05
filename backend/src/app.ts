import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { authRoutes } from './routes/authRoutes.js'
import { crudRoutes } from './routes/crudRoutes.js'
import { reportRoutes } from './routes/reportRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ ok: true, service: 'Diptish Gohane Finance OS API' }))
app.use('/api/auth', authRoutes)
app.use('/api/income', crudRoutes('income_sources'))
app.use('/api/expenses', crudRoutes('expenses'))
app.use('/api/monthly-plans', crudRoutes('monthly_plans'))
app.use('/api/loans', crudRoutes('loans'))
app.use('/api/emis', crudRoutes('emi_payments'))
app.use('/api/goals', crudRoutes('savings_goals'))
app.use('/api/wishlist', crudRoutes('wishlist_items'))
app.use('/api/reports', reportRoutes)
app.use(errorHandler)
