const tones: Record<string, string> = {
  active: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  paid: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  planned: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  unpaid: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  overdue: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
  watch: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
}

export function StatusBadge({ value }: { value: unknown }) {
  const text = String(value ?? 'Active')
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[text.toLowerCase()] ?? tones.active}`}>{text}</span>
}
