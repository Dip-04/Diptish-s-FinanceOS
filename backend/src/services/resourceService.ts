import { randomUUID } from 'node:crypto'
import { supabase } from '../config/supabase.js'
import type { FinanceRecord, ResourceName } from '../types/finance.js'

const memoryDb = new Map<ResourceName, FinanceRecord[]>()

const writableColumns: Record<ResourceName, readonly string[]> = {
  income_sources: ['id', 'user_id', 'source_name', 'amount', 'received_date', 'month', 'year', 'income_type', 'recurring', 'taxable', 'notes', 'attachment_url'],
  expenses: ['id', 'user_id', 'expense_name', 'category', 'amount', 'month', 'year', 'due_date', 'paid_date', 'status', 'priority', 'mandatory', 'recurring', 'payment_mode', 'notes'],
  monthly_plans: ['id', 'user_id', 'month', 'year', 'planned_income', 'actual_income'],
  loans: ['id', 'user_id', 'loan_name', 'lender_name', 'loan_type', 'total_loan_amount', 'principal_amount', 'interest_rate', 'processing_fee', 'emi_amount', 'emi_date', 'start_date', 'end_date', 'tenure_months', 'paid_amount', 'outstanding_amount', 'interest_paid', 'remaining_interest', 'prepayment_allowed', 'foreclosure_charges', 'status', 'notes'],
  emi_payments: ['id', 'user_id', 'loan_id', 'emi_name', 'amount', 'due_date', 'paid_status', 'penalty_amount', 'reminder_date', 'notes'],
  savings_goals: ['id', 'user_id', 'goal_name', 'target_amount', 'current_saved_amount', 'deadline', 'priority', 'monthly_saving_required', 'status'],
  wishlist_items: ['id', 'user_id', 'item_name', 'amount', 'priority', 'best_purchase_month', 'monthly_saving_required', 'status', 'notes'],
}

const fieldAliases: Partial<Record<ResourceName, Record<string, string>>> = {
  emi_payments: { status: 'paid_status' },
  savings_goals: { amount: 'target_amount', due_date: 'deadline' },
}

function cleanValue(value: unknown) {
  if (value === '' || value === undefined) return undefined
  if (typeof value === 'number' && Number.isNaN(value)) return undefined
  return value
}

function cleanColumnValue(resource: ResourceName, column: string, value: unknown) {
  const cleaned = cleanValue(value)
  if (cleaned === undefined) return undefined

  return cleaned
}

function normalizePayload(resource: ResourceName, payload: FinanceRecord) {
  const allowed = new Set(writableColumns[resource])
  const aliases = fieldAliases[resource] ?? {}
  const normalized: FinanceRecord = {}

  for (const [key, rawValue] of Object.entries(payload)) {
    const column = aliases[key] ?? key
    const value = cleanColumnValue(resource, column, rawValue)
    if (value !== undefined && allowed.has(column)) {
      normalized[column] = value
    }
  }

  return normalized
}

function table(name: ResourceName) {
  const rows = memoryDb.get(name) ?? []
  memoryDb.set(name, rows)
  return rows
}

function shouldFallbackToMemory(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const details = [
    'message' in error ? error.message : '',
    'details' in error ? error.details : '',
    'hint' in error ? error.hint : '',
    'code' in error ? error.code : '',
    'cause' in error && error.cause && typeof error.cause === 'object' && 'message' in error.cause ? error.cause.message : '',
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase()

  return ['enotfound', 'getaddrinfo', 'fetch failed', 'failed to fetch', 'eai_again'].some((token) => details.includes(token))
}

async function withSupabaseFallback<T>(action: () => Promise<T>, fallback: () => T | Promise<T>) {
  try {
    return await action()
  } catch (error) {
    if (!shouldFallbackToMemory(error)) throw error
    console.warn('Supabase unreachable, using local memory mode:', error)
    return fallback()
  }
}

export class ResourceService {
  constructor(private readonly resource: ResourceName) {}

  async list() {
    if (supabase) {
      const client = supabase
      return withSupabaseFallback(
        async () => {
          const { data, error } = await client.from(this.resource).select('*').order('created_at', { ascending: false })
          if (error) throw error
          return data ?? []
        },
        () => table(this.resource),
      )
    }
    return table(this.resource)
  }

  async create(payload: FinanceRecord) {
    const now = new Date().toISOString()
    const record = { id: payload.id ?? randomUUID(), ...normalizePayload(this.resource, payload), created_at: now, updated_at: now }
    if (supabase) {
      const client = supabase
      return withSupabaseFallback(
        async () => {
          const { data, error } = await client.from(this.resource).insert(record).select('*').single()
          if (error) throw error
          return data
        },
        () => {
          table(this.resource).unshift(record)
          return record
        },
      )
    }
    table(this.resource).unshift(record)
    return record
  }

  async update(id: string, payload: FinanceRecord) {
    const updates = { ...normalizePayload(this.resource, payload), updated_at: new Date().toISOString() }
    if (supabase) {
      const client = supabase
      return withSupabaseFallback(
        async () => {
          const { data, error } = await client.from(this.resource).update(updates).eq('id', id).select('*').single()
          if (error) throw error
          return data
        },
        () => {
          const rows = table(this.resource)
          const index = rows.findIndex((row) => row.id === id)
          if (index === -1) throw new Error('Record not found')
          rows[index] = { ...rows[index], ...updates }
          return rows[index]
        },
      )
    }
    const rows = table(this.resource)
    const index = rows.findIndex((row) => row.id === id)
    if (index === -1) throw new Error('Record not found')
    rows[index] = { ...rows[index], ...updates }
    return rows[index]
  }

  async remove(id: string) {
    if (supabase) {
      const client = supabase
      return withSupabaseFallback(
        async () => {
          const { error } = await client.from(this.resource).delete().eq('id', id)
          if (error) throw error
          return { id }
        },
        () => {
          memoryDb.set(this.resource, table(this.resource).filter((row) => row.id !== id))
          return { id }
        },
      )
    }
    memoryDb.set(this.resource, table(this.resource).filter((row) => row.id !== id))
    return { id }
  }
}
