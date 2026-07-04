export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'

const locales: Record<CurrencyCode, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AED: 'en-AE',
}

export const currency = (value: number, code: CurrencyCode = 'INR') =>
  new Intl.NumberFormat(locales[code], { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(value)

export const percent = (value: number) => `${Math.round(value)}%`

export const monthLabel = (month: number, year: number) =>
  new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
