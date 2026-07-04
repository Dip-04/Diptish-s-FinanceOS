import { create } from 'zustand'

type FinanceState = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useFinanceStore = create<FinanceState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
