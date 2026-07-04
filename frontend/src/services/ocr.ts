import { createWorker } from 'tesseract.js'

export type OcrProgress = {
  status: string
  progress: number
}

export type ParsedTransaction = {
  type: 'income' | 'expense'
  amount: number
  merchant: string
  category: string
  raw: string
}

export async function extractTextFromImage(file: File, onProgress?: (progress: OcrProgress) => void) {
  const worker = await createWorker('eng', 1, {
    logger: (message) => {
      if (message.status) onProgress?.({ status: message.status, progress: message.progress ?? 0 })
    },
  })

  try {
    const { data } = await worker.recognize(file)
    return data.text
  } finally {
    await worker.terminate()
  }
}

export function parseTransactionsFromText(text: string): ParsedTransaction[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.flatMap((line) => {
    const amountMatch = line.match(/(?:rs\.?|inr|₹)?\s*([0-9]+(?:,[0-9]{2,3})*(?:\.[0-9]{1,2})?)/i)
    if (!amountMatch) return []

    const amount = Number(amountMatch[1].replace(/,/g, ''))
    if (!Number.isFinite(amount) || amount <= 0) return []

    const lower = line.toLowerCase()
    const type: ParsedTransaction['type'] = /credit|credited|salary|refund|received|cr\b/.test(lower) ? 'income' : 'expense'
    const category = /petrol|fuel/.test(lower)
      ? 'Petrol'
      : /rent/.test(lower)
        ? 'Rent'
        : /food|swiggy|zomato|restaurant/.test(lower)
          ? 'Food'
          : /emi|loan|slice|hdfc|sbi/.test(lower)
            ? 'EMI'
            : type === 'income'
              ? 'Income'
              : 'Other'

    const merchant = line
      .replace(amountMatch[0], '')
      .replace(/\b(debit|credited|credit|upi|inr|rs|dr|cr)\b/gi, '')
      .replace(/[^a-z0-9 @._-]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 48) || category

    return [{ type, amount, merchant, category, raw: line }]
  })
}
