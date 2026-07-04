import { useState } from 'react'
import { CheckCircle2, FileScan, Loader2 } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { PageHeader } from '../components/ui/PageHeader'
import { extractTextFromImage, parseTransactionsFromText, type ParsedTransaction } from '../services/ocr'
import { currency } from '../utils/format'

export function OCRPage() {
  const [text, setText] = useState('')
  const [progress, setProgress] = useState('')
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([])
  const [busy, setBusy] = useState(false)

  async function runBrowserOcr(file: File) {
    if (file.type === 'application/pdf') {
      setProgress('PDF selected. Browser OCR is best for images; use backend mock/provider flow for complex PDFs.')
      return
    }

    setBusy(true)
    setProgress('Starting OCR...')
    try {
      const extracted = await extractTextFromImage(file, (event) => {
        setProgress(`${event.status} ${Math.round(event.progress * 100)}%`)
      })
      setText(extracted)
      setTransactions(parseTransactionsFromText(extracted))
      setProgress('OCR complete')
    } catch {
      setProgress('OCR failed. Try a clearer image or smaller file.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader title="OCR Scanner" subtitle="Free browser-side OCR using Tesseract.js. No OCR API key is required for image bills or image statements." icon={FileScan} />
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard className="p-5">
          <div className="rounded-3xl border border-dashed border-[#C6FF3D]/30 bg-[#C6FF3D]/5 p-8 text-center">
            <FileScan className="mx-auto text-[#C6FF3D]" size={34} />
            <h3 className="mt-4 text-xl font-semibold text-white">Image OCR Scanner</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Upload a bill or screenshot/image statement. OCR runs locally in your browser.</p>
            <input type="file" accept="image/*,application/pdf" onChange={(event) => event.target.files?.[0] && void runBrowserOcr(event.target.files[0])} className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-zinc-300" />
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#F5C76B]">
              {busy && <Loader2 className="animate-spin" size={16} />}
              {progress || 'Waiting for upload'}
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-xl font-semibold text-white">Extracted text</h3>
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-3xl bg-black/25 p-4 text-xs leading-5 text-zinc-300">{text || 'OCR output will appear here.'}</pre>
        </GlassCard>
      </div>
      <GlassCard className="mt-5 p-5">
        <h2 className="text-xl font-semibold text-white">Review queue</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(transactions.length ? transactions : [
            { type: 'expense', amount: 500, merchant: 'UPI Petrol Pump', category: 'Petrol', raw: 'Mock fallback' },
            { type: 'income', amount: 92000, merchant: 'Salary Credit', category: 'Income', raw: 'Mock fallback' },
          ]).map((item) => (
            <div key={`${item.raw}-${item.amount}`} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-4 text-sm text-zinc-300">
              <CheckCircle2 className="text-[#4ADE80]" size={18} />
              <span className="flex-1">{item.merchant} - {item.category}</span>
              <strong className="text-white">{currency(item.amount)}</strong>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
