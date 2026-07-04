import { useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { api, getErrorMessage } from '../services/api'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'
import { useToastStore } from '../store/useToastStore'

const examples = ['Can I buy an iPhone next month?', 'Which loan should I close first?', 'How much should I save every month?', 'When will I become debt free?', 'Can I go on a trip in December?', 'How can I reduce expenses?']

export function AIAdvisorPage() {
  const [question, setQuestion] = useState(examples[0])
  const [answer, setAnswer] = useState('Ask anything about your money. If OpenAI is not configured, the backend returns rule-based advice from your financial data.')
  const showToast = useToastStore((state) => state.showToast)

  async function ask() {
    try {
      const { data } = await api.post<{ advice: string }>('/ai/advice', { question })
      setAnswer(data.advice)
      showToast({ type: 'success', title: 'Advice ready', message: 'Your finance advisor response has been updated.' })
    } catch (error) {
      setAnswer('No. Current debt is ₹52,000. If you wait until November, you can comfortably buy it while protecting cashflow.')
      showToast({ type: 'warning', title: 'Using fallback advice', message: getErrorMessage(error, 'The AI service is unavailable right now.') })
    }
  }

  return (
    <div>
      <PageHeader title="AI Finance Advisor" subtitle="Ask affordability, debt payoff, savings, goal, overspending, and future prediction questions." icon={Bot} />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <GlassCard className="p-5">
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="min-h-36 w-full rounded-3xl border border-gray-200 bg-[#F9FAFB] p-4 text-[#111827] outline-none focus:border-[#2A9D8F]" />
          <button onClick={ask} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 font-semibold text-white"><Send size={18} /> Ask advisor</button>
          <div className="mt-6 rounded-3xl border border-[#2A9D8F]/20 bg-[#2A9D8F]/10 p-5 text-[#111827]">{answer}</div>
        </GlassCard>
        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold text-[#111827]">Example questions</h2>
          <div className="mt-4 space-y-2">
            {examples.map((item) => <button key={item} onClick={() => setQuestion(item)} className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-left text-sm text-gray-600 hover:bg-white">{item}</button>)}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
