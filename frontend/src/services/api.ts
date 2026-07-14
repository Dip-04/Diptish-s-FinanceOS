import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
})

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object') {
      const payload = data as { message?: unknown; error?: unknown }
      if (typeof payload.message === 'string' && payload.message.trim()) return payload.message
      if (typeof payload.error === 'string' && payload.error.trim()) return payload.error
    }
    if (error.response?.status === 401) return 'Your session expired. Please login again.'
    if (error.response?.status === 403) return 'You do not have permission to perform this action.'
    if (error.response?.status === 404) return 'The requested item was not found.'
    if (error.response?.status && error.response.status >= 500) return 'Server error. Please try again in a moment.'
    if (error.code === 'ERR_NETWORK') return 'Network error. Check your connection and try again.'
  }

  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}

export async function listRecords<T>(endpoint: string): Promise<T[]> {
  const { data } = await api.get<T[]>(endpoint)
  return data
}

export async function createRecord<T>(endpoint: string, payload: T): Promise<T> {
  const { data } = await api.post<T>(endpoint, payload)
  return data
}

export async function updateRecord<T>(endpoint: string, id: string, payload: T): Promise<T> {
  const { data } = await api.put<T>(`${endpoint}/${id}`, payload)
  return data
}

export async function deleteRecord(endpoint: string, id: string): Promise<void> {
  await api.delete(`${endpoint}/${id}`)
}
