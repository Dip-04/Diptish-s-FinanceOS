import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle: string
  icon: LucideIcon
  action?: ReactNode
}

export function PageHeader({ title, subtitle, icon: Icon, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start gap-4">
        <span className="rounded-3xl border border-gray-100 bg-white p-4 text-[#E76F51] shadow-sm">
          <Icon size={26} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-[#111827] sm:text-3xl md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
