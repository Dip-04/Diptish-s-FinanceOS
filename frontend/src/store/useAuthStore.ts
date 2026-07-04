import { create } from 'zustand'
import type { AuthSession, AuthUser } from '../services/auth'

const LOCAL_KEY = 'finance-os-auth'
const SESSION_KEY = 'finance-os-session-auth'

type AuthState = {
  user: AuthUser | null
  session: AuthSession | null
  rememberMe: boolean
  hydrate: () => void
  setAuth: (payload: { user: AuthUser; session?: AuthSession | null; rememberMe: boolean }) => void
  clearAuth: () => void
}

function readStoredAuth() {
  const raw = localStorage.getItem(LOCAL_KEY) ?? sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { user: AuthUser; session: AuthSession | null; rememberMe: boolean }
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  rememberMe: false,
  hydrate: () => {
    const stored = readStoredAuth()
    if (stored) set(stored)
  },
  setAuth: ({ user, session = null, rememberMe }) => {
    const state = { user, session, rememberMe }
    localStorage.removeItem(LOCAL_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    if (rememberMe) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
    }
    set(state)
  },
  clearAuth: () => {
    localStorage.removeItem(LOCAL_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    set({ user: null, session: null, rememberMe: false })
  },
}))
