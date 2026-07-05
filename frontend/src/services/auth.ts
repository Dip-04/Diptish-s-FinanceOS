import { api } from './api'

export type AuthUser = {
  id?: string
  email: string
  fullName?: string
  name?: string
  phone?: string
}

export type AuthSession = {
  access_token?: string
  refresh_token?: string
}

export type AuthPayload = {
  user: AuthUser
  session?: AuthSession
}

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthPayload>('/auth/login', { email, password })
  return data
}

export async function requestLoginOtp(phone: string) {
  const { data } = await api.post<{ ok: boolean; message?: string; phone: string }>('/auth/request-otp', { phone })
  return data
}

export async function verifyLoginOtp(phone: string, otp: string) {
  const { data } = await api.post<AuthPayload>('/auth/verify-otp', { phone, otp })
  return data
}

export async function register(fullName: string, email: string, password: string) {
  const { data } = await api.post<AuthPayload>('/auth/register', { fullName, email, password })
  return data
}

export async function logout() {
  await api.post('/auth/logout')
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<{ ok: boolean; message?: string }>('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(email: string, password: string) {
  const { data } = await api.post<{ ok: boolean; message?: string }>('/auth/reset-password', { email, password })
  return data
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data } = await api.post<{ ok: boolean; message?: string }>('/auth/change-password', { currentPassword, newPassword })
  return data
}

export async function updateProfile(payload: Record<string, unknown>) {
  const { data } = await api.put<AuthUser>('/auth/profile', payload)
  return data
}
