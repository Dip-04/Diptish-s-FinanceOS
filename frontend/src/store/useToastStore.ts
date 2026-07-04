import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type ToastItem = {
  id: string
  type: ToastType
  title: string
  message?: string
}

type ToastInput = Omit<ToastItem, 'id'>

type ToastState = {
  toasts: ToastItem[]
  showToast: (toast: ToastInput) => void
  dismissToast: (id: string) => void
}

const TOAST_TIMEOUT_MS = 4200

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }))
    }, TOAST_TIMEOUT_MS)
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}))
