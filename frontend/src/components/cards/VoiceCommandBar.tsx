import { Mic, Send } from 'lucide-react'
import { useState } from 'react'

export function VoiceCommandBar({ onSubmit }: { onSubmit: (command: string) => void }) {
  const [command, setCommand] = useState('Add ₹500 petrol expense')

  function listen() {
    const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.onresult = (event) => setCommand(event.results[0]?.[0]?.transcript ?? command)
    recognition.start()
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-3 sm:flex-row">
      <button onClick={listen} className="rounded-2xl bg-[#111827] px-4 py-3 text-white" aria-label="Start voice command"><Mic size={20} /></button>
      <input value={command} onChange={(event) => setCommand(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#2A9D8F]" />
      <button onClick={() => onSubmit(command)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E76F51] px-4 py-3 font-semibold text-white"><Send size={18} /> Process</button>
    </div>
  )
}
