import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { DataTable } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { FormControl } from '../components/ui/FormControls'
import { GlassCard } from '../components/ui/GlassCard'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { modules } from '../constants/finance'
import { createRecord, listRecords } from '../services/api'
import type { FinanceRecord } from '../types/finance'

export function ModulePage({ id }: { id: keyof typeof modules }) {
  const config = modules[id]
  const [rows, setRows] = useState<FinanceRecord[]>(config.seed)
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<FinanceRecord>()

  useEffect(() => {
    void listRecords(config.endpoint, config.seed).then(setRows)
  }, [config.endpoint, config.seed])

  const metrics = useMemo(() => {
    const total = rows.reduce((sum, row) => sum + Number(row.amount ?? row.outstanding_amount ?? row.total_loan_amount ?? 0), 0)
    return { total, count: rows.length }
  }, [rows])

  async function onSubmit(values: FinanceRecord) {
    const payload = { id: crypto.randomUUID(), status: 'Active', ...values }
    setRows((current) => [payload, ...current])
    setOpen(false)
    reset()
    try {
      await createRecord(config.endpoint, payload)
    } catch {
      // Local optimistic data keeps the app useful when Supabase is not configured.
    }
  }

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20"><Plus size={18} /> Add record</button>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <GlassCard className="p-5">
          <p className="text-sm text-slate-400">Total tracked</p>
          <strong className="mt-2 block text-3xl font-semibold text-slate-50">₹{metrics.total.toLocaleString('en-IN')}</strong>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-slate-400">Records</p>
          <strong className="mt-2 block text-3xl font-semibold text-slate-50">{metrics.count}</strong>
        </GlassCard>
      </div>
      <GlassCard className="p-4">
        {rows.length ? <DataTable rows={rows} columns={config.columns} /> : <EmptyState />}
      </GlassCard>
      <Modal title={`Add ${config.title}`} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2">
          {config.fields.map((field) => <FormControl key={field.name} field={field} register={register} />)}
          <button className="rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-3 font-semibold text-slate-950 md:col-span-2">Save record</button>
        </form>
      </Modal>
    </div>
  )
}
