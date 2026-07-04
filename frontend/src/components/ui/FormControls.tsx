import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import type { ModuleField } from '../../types/finance'

type FormControlProps<T extends FieldValues> = {
  field: ModuleField
  register: UseFormRegister<T>
}

export function FormControl<T extends FieldValues>({ field, register }: FormControlProps<T>) {
  const base = 'w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70'
  const name = field.name as Path<T>

  if (field.type === 'textarea') {
    return <textarea {...register(name)} rows={3} placeholder={field.label} className={base} />
  }

  if (field.type === 'select') {
    return (
      <select {...register(name)} className={base}>
        <option value="">{field.label}</option>
        {field.options?.map((option) => <option key={option}>{option}</option>)}
      </select>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
        <input {...register(name)} type="checkbox" className="h-4 w-4 accent-cyan-300" />
        {field.label}
      </label>
    )
  }

  return <input {...register(name, { valueAsNumber: field.type === 'number' })} type={field.type ?? 'text'} placeholder={field.label} className={base} />
}
