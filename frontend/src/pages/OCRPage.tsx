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
          <div className="rounded-3xl border border-dashed border-[#2A9D8F]/30 bg-[#2A9D8F]/5 p-8 text-center">
            <FileScan className="mx-auto text-[#2A9D8F]" size={34} />
            <h3 className="mt-4 text-xl font-semibold text-[#111827]">Image OCR Scanner</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">Upload a bill or screenshot/image statement. OCR runs locally in your browser.</p>
            <input type="file" accept="image/*,application/pdf" onChange={(event) => event.target.files?.[0] && void runBrowserOcr(event.target.files[0])} className="mt-5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600" />
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#E76F51]">
              {busy && <Loader2 className="animate-spin" size={16} />}
              {progress || 'Waiting for upload'}
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-xl font-semibold text-[#111827]">Extracted text</h3>
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-3xl bg-[#F1F5F9] p-4 text-xs leading-5 text-gray-600">{text || 'OCR output will appear here.'}</pre>
        </GlassCard>
      </div>
      <GlassCard className="mt-5 p-5">
        <h2 className="text-xl font-semibold text-[#111827]">Review queue</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(transactions.length ? transactions : [
            { type: 'expense', amount: 500, merchant: 'UPI Petrol Pump', category: 'Petrol', raw: 'Mock fallback' },
            { type: 'income', amount: 92000, merchant: 'Salary Credit', category: 'Income', raw: 'Mock fallback' },
          ]).map((item) => (
            <div key={`${item.raw}-${item.amount}`} className="flex items-center gap-3 rounded-2xl bg-[#F9FAFB] p-4 text-sm text-gray-600">
              <CheckCircle2 className="text-[#4ADE80]" size={18} />
              <span className="flex-1">{item.merchant} - {item.category}</span>
              <strong className="text-[#111827]">{currency(item.amount)}</strong>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
