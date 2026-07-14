import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { DataTable } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { FormControl } from '../components/ui/FormControls'
import { GlassCard } from '../components/ui/GlassCard'
import { LoadingState } from '../components/ui/LoadingState'
import { Modal } from '../components/ui/Modal'
import { MobileCardList } from '../components/ui/MobileCardList'
import { PageHeader } from '../components/ui/PageHeader'
import { modules } from '../constants/finance'
import { createRecord, deleteRecord, getErrorMessage, listRecords, updateRecord } from '../services/api'
import { useToastStore } from '../store/useToastStore'
import type { FinanceRecord } from '../types/finance'

const dailyExpenseCategories = new Set(['food', 'travel', 'petrol', 'shopping', 'tea/snacks', 'entertainment'])
const monthlyExpenseCategories = new Set(['rent', 'bills', 'groceries', 'subscription', 'medical', 'education', 'emi', 'loan', 'savings'])
const filterableModules = new Set(['income', 'monthly-expenses', 'daily-expenses', 'expenses', 'emis', 'purchases'])
const expenseLikeModules = new Set(['monthly-expenses', 'daily-expenses', 'expenses', 'emis', 'purchases'])

function normalizeFormValues(values: FinanceRecord) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== ''),
  ) as FinanceRecord
}

function getDateValue(row: FinanceRecord) {
  const value = row.due_date ?? row.received_date ?? row.deadline ?? null
  return typeof value === 'string' ? value : null
}

function getExpenseScope(row: FinanceRecord) {
  if (typeof row.recurring === 'boolean') return row.recurring ? 'monthly' : 'daily'

  const category = String(row.category ?? '').trim().toLowerCase()
  if (dailyExpenseCategories.has(category)) return 'daily'
  if (monthlyExpenseCategories.has(category)) return 'monthly'

  return Number(row.amount ?? 0) >= 2000 ? 'monthly' : 'daily'
}

function matchesDateFilter(row: FinanceRecord, dateFilter: string) {
  if (dateFilter === 'all') return true

  const rawDate = getDateValue(row)
  if (!rawDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const itemDate = new Date(rawDate)
  itemDate.setHours(0, 0, 0, 0)

  return dateFilter === 'future' ? itemDate >= today : itemDate < today
}

function matchesStatusFilter(row: FinanceRecord, statusFilter: string) {
  if (statusFilter === 'all') return true

  const status = String(row.status ?? '').trim().toLowerCase()
  if (statusFilter === 'paid') return status === 'paid' || status === 'completed'
  if (statusFilter === 'overdue') return status === 'overdue'
  if (statusFilter === 'pending') return ['planned', 'unpaid', 'overdue', 'active'].includes(status)
  return true
}

export function ModulePage({ id }: { id: keyof typeof modules }) {
  const config = modules[id]
  const defaultStatus = config.fields.find((field) => field.name === 'status')?.options?.[0] ?? 'Active'
  const [rows, setRows] = useState<FinanceRecord[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FinanceRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const showToast = useToastStore((state) => state.showToast)
  const { register, handleSubmit, reset } = useForm<FinanceRecord>()

  useEffect(() => {
    let active = true

    async function loadRows() {
      setIsLoading(true)
      try {
        const data = await listRecords<FinanceRecord>(config.endpoint)
        if (!active) return
        setRows(data)
      } catch (error) {
        if (!active) return
        setRows([])
        showToast({ type: 'warning', title: 'Could not load records', message: getErrorMessage(error, 'We could not load data from the API.') })
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadRows()

    return () => {
      active = false
    }
  }, [config.endpoint, showToast])

  useEffect(() => {
    setStatusFilter('all')
    setDateFilter('all')
    setTypeFilter('all')
  }, [id])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (id === 'monthly-expenses' && getExpenseScope(row) !== 'monthly') return false
      if (id === 'daily-expenses' && getExpenseScope(row) !== 'daily') return false

      if (id === 'expenses' && typeFilter !== 'all' && getExpenseScope(row) !== typeFilter) return false

      if (id === 'income') {
        const incomeType = String(row.income_type ?? '').trim().toLowerCase()
        if (typeFilter === 'salary' && incomeType !== 'salary') return false
        if (typeFilter === 'other' && incomeType === 'salary') return false
      }

      if (expenseLikeModules.has(id) && !matchesStatusFilter(row, statusFilter)) return false

      return matchesDateFilter(row, dateFilter)
    })
  }, [dateFilter, id, rows, statusFilter, typeFilter])

  const metrics = useMemo(() => {
    const total = filteredRows.reduce((sum, row) => sum + Number(row.amount ?? row.outstanding_amount ?? row.total_loan_amount ?? 0), 0)
    return { total, count: filteredRows.length }
  }, [filteredRows])

  async function onSubmit(values: FinanceRecord) {
    const normalizedValues = normalizeFormValues(values)
    const normalizedExpenseScope = id === 'monthly-expenses' ? { recurring: true } : id === 'daily-expenses' ? { recurring: false } : {}
    const payload = {
      id: editing?.id ?? crypto.randomUUID(),
      status: editing?.status ?? defaultStatus,
      ...editing,
      ...normalizedValues,
      ...normalizedExpenseScope,
    }
    setRows((current) => editing ? current.map((row) => row.id === editing.id ? payload : row) : [payload, ...current])
    setOpen(false)
    setEditing(null)
    reset()
    try {
      if (editing?.id) {
        await updateRecord(config.endpoint, String(editing.id), payload)
        showToast({ type: 'success', title: 'Record updated', message: `${config.title} was saved successfully.` })
      } else {
        await createRecord(config.endpoint, payload)
        showToast({ type: 'success', title: 'Record added', message: `${config.title} was saved successfully.` })
      }
    } catch (error) {
      showToast({ type: 'warning', title: 'Saved locally', message: getErrorMessage(error, 'We could not reach the server. Please try again later.') })
    }
  }

  function startCreate() {
    setEditing(null)
    reset({})
    setOpen(true)
  }

  function startEdit(row: FinanceRecord) {
    setEditing(row)
    reset(row)
    setOpen(true)
  }

  async function removeRow(row: FinanceRecord) {
    const entryId = String(row.id ?? '')
    if (!entryId) {
      showToast({ type: 'error', title: 'Delete failed', message: 'This record does not have a valid ID.' })
      return
    }
    setRows((current) => current.filter((item) => item.id !== row.id))
    try {
      await deleteRecord(config.endpoint, entryId)
      showToast({ type: 'success', title: 'Record deleted', message: `${config.title} was removed successfully.` })
    } catch (error) {
      showToast({ type: 'warning', title: 'Deleted locally', message: getErrorMessage(error, 'We could not reach the server. Please try again later.') })
    }
  }

  const rowActions = (row: FinanceRecord) => (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => startEdit(row)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#111827] shadow-sm">
        <Pencil size={15} />
        Edit
      </button>
      <button type="button" onClick={() => void removeRow(row)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#DC2626] px-3 py-2 text-sm font-semibold text-white shadow-sm">
        <Trash2 size={15} />
        Delete
      </button>
    </div>
  )

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        action={<button onClick={startCreate} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white shadow-sm"><Plus size={18} /> Add record</button>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <GlassCard className="p-5">
          <p className="text-sm text-gray-500">Total tracked</p>
          <strong className="mt-2 block text-3xl font-semibold text-[#111827]">Rs {metrics.total.toLocaleString('en-IN')}</strong>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-gray-500">Records</p>
          <strong className="mt-2 block text-3xl font-semibold text-[#111827]">{metrics.count}</strong>
        </GlassCard>
      </div>
      {filterableModules.has(id) && (
        <GlassCard className="mb-5 grid gap-3 p-4 md:grid-cols-3">
          {id === 'income' ? (
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#2A9D8F]">
              <option value="all">All income</option>
              <option value="salary">Salary</option>
              <option value="other">Other income</option>
            </select>
          ) : id === 'emis' ? (
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#2A9D8F]">
              <option value="all">All EMI</option>
              <option value="paid">Paid EMI</option>
              <option value="overdue">Overdue EMI</option>
            </select>
          ) : (
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#2A9D8F]">
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          )}
          <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#2A9D8F]">
            <option value="all">All dates</option>
            <option value="future">Future</option>
            <option value="past">Past</option>
          </select>
          {id === 'expenses' ? (
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#2A9D8F]">
              <option value="all">All expenses</option>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          ) : (
            <div className="flex items-center rounded-2xl border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500">
              {id === 'income' ? 'Filter salary and past or future income here.' : 'Filter pending or paid items with past or future dates here.'}
            </div>
          )}
        </GlassCard>
      )}
      <GlassCard className="p-4">
        {isLoading ? <LoadingState /> : filteredRows.length ? <><MobileCardList rows={filteredRows} columns={config.columns} renderActions={rowActions} /><DataTable rows={filteredRows} columns={config.columns} renderActions={rowActions} /></> : <EmptyState />}
      </GlassCard>
      <Modal title={`${editing ? 'Edit' : 'Add'} ${config.title}`} open={open} onClose={() => { setOpen(false); setEditing(null); reset({}) }}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2">
          {config.fields.map((field) => <FormControl key={field.name} field={field} register={register} />)}
          <button className="min-h-12 rounded-2xl bg-[#111827] px-4 py-3 font-semibold text-white md:col-span-2">Save record</button>
        </form>
      </Modal>
    </div>
  )
}
