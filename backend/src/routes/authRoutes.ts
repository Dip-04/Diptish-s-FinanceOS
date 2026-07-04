import { Router } from 'express'
import { z } from 'zod'
import { supabase } from '../config/supabase.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const authSchema = z.object({ email: z.string().email(), password: z.string().min(6), fullName: z.string().optional() })
const resetPasswordSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
const changePasswordSchema = z.object({ currentPassword: z.string().min(6), newPassword: z.string().min(6), email: z.string().email().optional() })
export const authRoutes = Router()

authRoutes.post('/register', asyncHandler(async (req, res) => {
  const payload = authSchema.parse(req.body)
  if (!supabase) return res.status(201).json({ user: { id: 'local-user', email: payload.email, fullName: payload.fullName }, mode: 'local' })
  const { data, error } = await supabase.auth.admin.createUser({ email: payload.email, password: payload.password, email_confirm: true, user_metadata: { full_name: payload.fullName } })
  if (error) throw error
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: payload.email,
      full_name: payload.fullName,
      currency_preference: 'INR',
      updated_at: new Date().toISOString(),
    })
  }
  return res.status(201).json({
    ...data,
    user: data.user ? { ...data.user, fullName: payload.fullName } : data.user,
  })
}))

authRoutes.post('/login', asyncHandler(async (req, res) => {
  const payload = authSchema.pick({ email: true, password: true }).parse(req.body)
  if (!supabase) return res.json({ session: { access_token: 'local-dev-token' }, user: { email: payload.email } })
  const { data, error } = await supabase.auth.signInWithPassword(payload)
  if (error) throw error
  const { data: profile } = data.user
    ? await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle()
    : { data: null }
  return res.json({
    ...data,
    profile,
    user: data.user ? {
      ...data.user,
      fullName: profile?.full_name ?? data.user.user_metadata?.full_name,
      phone: profile?.phone ?? data.user.phone,
      currency: profile?.currency_preference,
      monthlySalary: profile?.monthly_salary,
      defaultBudget: profile?.default_budget,
      financialGoal: profile?.financial_goal,
      notificationPreferences: profile?.notification_preferences,
      familyMembers: profile?.family_members,
    } : data.user,
  })
}))

authRoutes.post('/logout', (_req, res) => res.json({ ok: true }))
authRoutes.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body)
  if (!supabase) return res.json({ ok: true, mode: 'local', email })
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
  return res.json({ ok: true })
}))
authRoutes.post('/reset-password', asyncHandler(async (req, res) => {
  const payload = resetPasswordSchema.parse(req.body)
  if (!supabase) return res.json({ ok: true, mode: 'local', message: 'Password reset in local mode.', email: payload.email })
  return res.json({ ok: true, message: 'Use the Supabase password recovery link/session to finalize password reset securely.' })
}))
authRoutes.get('/profile', asyncHandler(async (req, res) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  if (!supabase || !userId) return res.json({ id: 'local-user', name: 'Diptish Gohane', email: 'diptish@example.com' })
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return res.json(data)
}))
authRoutes.put('/profile', asyncHandler(async (req, res) => {
  const profileSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    currency: z.string().optional(),
    monthlySalary: z.number().optional(),
    defaultBudget: z.number().optional(),
    financialGoal: z.string().optional(),
    notificationPreferences: z.string().optional(),
    familyMembers: z.string().optional(),
  })
  const payload = profileSchema.parse(req.body)
  if (!supabase || !payload.id) return res.json({ id: payload.id ?? 'local-user', ...req.body, updated_at: new Date().toISOString() })
  const { data, error } = await supabase.from('profiles').upsert({
    id: payload.id,
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    currency_preference: payload.currency,
    monthly_salary: payload.monthlySalary,
    default_budget: payload.defaultBudget,
    financial_goal: payload.financialGoal,
    notification_preferences: payload.notificationPreferences,
    family_members: payload.familyMembers,
    updated_at: new Date().toISOString(),
  }).select('*').single()
  if (error) throw error
  return res.json({
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    currency: data.currency_preference,
    monthlySalary: data.monthly_salary,
    defaultBudget: data.default_budget,
    financialGoal: data.financial_goal,
    notificationPreferences: data.notification_preferences,
    familyMembers: data.family_members,
  })
}))
authRoutes.post('/change-password', asyncHandler(async (req, res) => {
  const payload = changePasswordSchema.parse(req.body)
  if (!supabase) return res.json({ ok: true, mode: 'local', message: 'Password changed in local mode.' })
  return res.json({ ok: true, message: 'Password change request validated. In production, update password with the active Supabase user session.' })
}))
