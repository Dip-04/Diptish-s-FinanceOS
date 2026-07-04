import { Cloud, CloudOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getOfflineQueue } from '../../services/offlineSync'
import { useFinanceStore } from '../../store/useFinanceStore'

export function SyncStatus() {
  const { syncStatus, setSyncStatus } = useFinanceStore()
  const [queued, setQueued] = useState(getOfflineQueue().length)

  useEffect(() => {
    const refresh = () => {
      setSyncStatus(navigator.onLine ? 'online' : 'offline')
      setQueued(getOfflineQueue().length)
    }
    refresh()
    window.addEventListener('online', refresh)
    window.addEventListener('offline', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('online', refresh)
      window.removeEventListener('offline', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [setSyncStatus])

  const online = syncStatus === 'online'
  return (
    <div className={`fixed left-4 z-30 hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm sm:flex lg:left-80 ${online ? 'border-[#16A34A]/25 bg-white text-[#16A34A]' : 'border-[#F59E0B]/25 bg-white text-[#F59E0B]'}`} style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      {online ? <Cloud size={15} /> : <CloudOff size={15} />}
      {online ? 'Online' : 'Offline'}{queued ? ` · ${queued} queued` : ''}
    </div>
  )
}
