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
        <span className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-cyan-200">
          <Icon size={26} />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-slate-50 md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
