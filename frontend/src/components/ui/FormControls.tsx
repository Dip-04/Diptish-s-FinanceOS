import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import type { ModuleField } from '../../types/finance'

type FormControlProps<T extends FieldValues> = {
  field: ModuleField
  register: UseFormRegister<T>
}

export function FormControl<T extends FieldValues>({ field, register }: FormControlProps<T>) {
  const base = 'w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-gray-400 focus:border-[#2A9D8F]'
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
      <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-gray-600">
        <input {...register(name)} type="checkbox" className="h-4 w-4 accent-[#2A9D8F]" />
        {field.label}
      </label>
    )
  }

  return <input {...register(name, { valueAsNumber: field.type === 'number' })} type={field.type ?? 'text'} placeholder={field.label} className={base} />
}
