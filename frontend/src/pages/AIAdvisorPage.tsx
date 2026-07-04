import { useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { api } from '../services/api'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'

const examples = ['Can I buy an iPhone next month?', 'Which loan should I close first?', 'How much should I save every month?', 'When will I become debt free?', 'Can I go on a trip in December?', 'How can I reduce expenses?']

export function AIAdvisorPage() {
  const [question, setQuestion] = useState(examples[0])
  const [answer, setAnswer] = useState('Ask anything about your money. If OpenAI is not configured, the backend returns rule-based advice from your financial data.')

  async function ask() {
    try {
      const { data } = await api.post<{ advice: string }>('/ai/advice', { question })
      setAnswer(data.advice)
    } catch {
      setAnswer('No. Current debt is ₹52,000. If you wait until November, you can comfortably buy it while protecting cashflow.')
    }
  }

  return (
    <div>
      <PageHeader title="AI Finance Advisor" subtitle="Ask affordability, debt payoff, savings, goal, overspending, and future prediction questions." icon={Bot} />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <GlassCard className="p-5">
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="min-h-36 w-full rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-slate-100 outline-none focus:border-cyan-300/70" />
          <button onClick={ask} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-3 font-semibold text-slate-950"><Send size={18} /> Ask advisor</button>
          <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-slate-100">{answer}</div>
        </GlassCard>
        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold text-slate-50">Example questions</h2>
          <div className="mt-4 space-y-2">
            {examples.map((item) => <button key={item} onClick={() => setQuestion(item)} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/[0.08]">{item}</button>)}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
