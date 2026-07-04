import type { ElementType } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useToastStore, type ToastType } from '../../store/useToastStore'

const toastStyles: Record<ToastType, { icon: ElementType; border: string; iconColor: string }> = {
  success: { icon: CheckCircle2, border: 'border-[#16A34A]/30', iconColor: 'text-[#16A34A]' },
  error: { icon: AlertCircle, border: 'border-[#DC2626]/30', iconColor: 'text-[#DC2626]' },
  info: { icon: Info, border: 'border-[#2A9D8F]/30', iconColor: 'text-[#2A9D8F]' },
  warning: { icon: TriangleAlert, border: 'border-[#F59E0B]/30', iconColor: 'text-[#F59E0B]' },
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismissToast = useToastStore((state) => state.dismissToast)

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-5 sm:top-5">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type]
        const Icon = style.icon

        return (
          <div key={toast.id} className={`glass flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-lg ${style.border}`} role="status" aria-live="polite">
            <Icon className={`mt-0.5 shrink-0 ${style.iconColor}`} size={20} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#111827]">{toast.title}</p>
              {toast.message && <p className="mt-1 text-sm leading-5 text-gray-600">{toast.message}</p>}
            </div>
            <button type="button" onClick={() => dismissToast(toast.id)} className="rounded-xl p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
