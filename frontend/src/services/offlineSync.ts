const QUEUE_KEY = 'finance-os-sync-queue'

export type SyncQueueItem = {
  id: string
  resource: string
  operation: 'create' | 'update' | 'delete'
  payload: unknown
  clientUpdatedAt: string
}

export function enqueueOfflineAction(item: Omit<SyncQueueItem, 'id' | 'clientUpdatedAt'>) {
  const queue = getOfflineQueue()
  queue.push({ ...item, id: crypto.randomUUID(), clientUpdatedAt: new Date().toISOString() })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function getOfflineQueue(): SyncQueueItem[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as SyncQueueItem[]
  } catch {
    return []
  }
}

export function clearOfflineQueue() {
  localStorage.removeItem(QUEUE_KEY)
}
