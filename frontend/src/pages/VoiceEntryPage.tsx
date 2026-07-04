import { useState } from 'react'
import { Mic } from 'lucide-react'
import { VoiceCommandBar } from '../components/cards/VoiceCommandBar'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'

export function VoiceEntryPage() {
  const [result, setResult] = useState('Say or type: Add ₹500 petrol expense')
  return (
    <div>
      <PageHeader title="Voice Expense Entry" subtitle="Browser speech recognition when available, with manual fallback for every command." icon={Mic} />
      <GlassCard className="p-5">
        <VoiceCommandBar onSubmit={(command) => setResult(`Parsed command: ${command}. Ready to confirm as a transaction.`)} />
        <div className="mt-5 rounded-3xl border border-[#C6FF3D]/20 bg-[#C6FF3D]/10 p-5 text-white">{result}</div>
      </GlassCard>
    </div>
  )
}
