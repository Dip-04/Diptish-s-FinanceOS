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
      <button onClick={listen} className="rounded-2xl bg-[#C6FF3D] px-4 py-3 text-[#111111]" aria-label="Start voice command"><Mic size={20} /></button>
      <input value={command} onChange={(event) => setCommand(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#C6FF3D]/70" />
      <button onClick={() => onSubmit(command)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C6FF3D] to-[#F5C76B] px-4 py-3 font-semibold text-[#111111]"><Send size={18} /> Process</button>
    </div>
  )
}
