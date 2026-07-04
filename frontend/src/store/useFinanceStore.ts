import { create } from 'zustand'

type FinanceState = {
  sidebarOpen: boolean
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'
  syncStatus: 'online' | 'offline' | 'syncing'
  setSidebarOpen: (open: boolean) => void
  setCurrency: (currency: FinanceState['currency']) => void
  setSyncStatus: (status: FinanceState['syncStatus']) => void
}

export const useFinanceStore = create<FinanceState>((set) => ({
  sidebarOpen: false,
  currency: 'INR',
  syncStatus: navigator.onLine ? 'online' : 'offline',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrency: (currency) => set({ currency }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
}))
