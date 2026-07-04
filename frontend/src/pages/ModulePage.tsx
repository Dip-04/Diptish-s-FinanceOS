import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { DataTable } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { FormControl } from '../components/ui/FormControls'
import { GlassCard } from '../components/ui/GlassCard'
import { Modal } from '../components/ui/Modal'
import { MobileCardList } from '../components/ui/MobileCardList'
import { PageHeader } from '../components/ui/PageHeader'
import { modules } from '../constants/finance'
import { createRecord, deleteRecord, getErrorMessage, listRecords, updateRecord } from '../services/api'
import { enqueueOfflineAction } from '../services/offlineSync'
import { useToastStore } from '../store/useToastStore'
import type { FinanceRecord } from '../types/finance'

export function ModulePage({ id }: { id: keyof typeof modules }) {
  const config = modules[id]
  const [rows, setRows] = useState<FinanceRecord[]>(config.seed)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FinanceRecord | null>(null)
  const showToast = useToastStore((state) => state.showToast)
  const { register, handleSubmit, reset } = useForm<FinanceRecord>()

  useEffect(() => {
    void listRecords(config.endpoint, config.seed).then(setRows)
  }, [config.endpoint, config.seed])

  const metrics = useMemo(() => {
    const total = rows.reduce((sum, row) => sum + Number(row.amount ?? row.outstanding_amount ?? row.total_loan_amount ?? 0), 0)
    return { total, count: rows.length }
  }, [rows])

  async function onSubmit(values: FinanceRecord) {
    const payload = { id: editing?.id ?? crypto.randomUUID(), status: editing?.status ?? 'Active', ...values }
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
      enqueueOfflineAction({ resource: config.endpoint, operation: editing ? 'update' : 'create', payload })
      showToast({ type: 'warning', title: 'Saved offline', message: `${getErrorMessage(error, 'We could not reach the server.')} This change will sync when you are online.` })
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
    const id = String(row.id ?? '')
    if (!id) {
      showToast({ type: 'error', title: 'Delete failed', message: 'This record does not have a valid ID.' })
      return
    }
    setRows((current) => current.filter((item) => item.id !== row.id))
    try {
      await deleteRecord(config.endpoint, id)
      showToast({ type: 'success', title: 'Record deleted', message: `${config.title} was removed successfully.` })
    } catch (error) {
      enqueueOfflineAction({ resource: config.endpoint, operation: 'delete', payload: row })
      showToast({ type: 'warning', title: 'Delete queued offline', message: `${getErrorMessage(error, 'We could not reach the server.')} The delete will sync when you are online.` })
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
          <strong className="mt-2 block text-3xl font-semibold text-[#111827]">₹{metrics.total.toLocaleString('en-IN')}</strong>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-gray-500">Records</p>
          <strong className="mt-2 block text-3xl font-semibold text-[#111827]">{metrics.count}</strong>
        </GlassCard>
      </div>
      <GlassCard className="p-4">
        {rows.length ? <><MobileCardList rows={rows} columns={config.columns} renderActions={rowActions} /><DataTable rows={rows} columns={config.columns} renderActions={rowActions} /></> : <EmptyState />}
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
