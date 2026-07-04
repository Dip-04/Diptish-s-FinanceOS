import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
})

export async function listRecords<T>(endpoint: string, fallback: T[]): Promise<T[]> {
  try {
    const { data } = await api.get<T[]>(endpoint)
    return data
  } catch {
    return fallback
  }
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
