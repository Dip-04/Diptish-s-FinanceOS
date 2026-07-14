import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PropsWithChildren } from 'react'
import type { CategoryPoint, MoneyPoint } from '../../types/finance'
import { GlassCard } from '../ui/GlassCard'

const colors = ['#E76F51', '#2A9D8F', '#E9C46A', '#111827', '#16A34A', '#0EA5E9', '#F59E0B']

type ChartGridProps = {
  cashflow: MoneyPoint[]
  categories: CategoryPoint[]
}

export function ChartGrid({ cashflow, categories }: ChartGridProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <ChartShell title="Income vs Expenses" className="xl:col-span-2">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cashflow}>
            <CartesianGrid stroke="rgba(17,24,39,0.08)" vertical={false} />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ background: '#FFFFFF', color: '#111827', border: '1px solid rgba(17,24,39,0.1)', borderRadius: 16 }} />
            <Bar dataKey="income" fill="#2A9D8F" radius={[10, 10, 0, 0]} />
            <Bar dataKey="expenses" fill="#E76F51" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Spending Categories">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={categories} dataKey="value" nameKey="name" innerRadius={68} outerRadius={100} paddingAngle={4}>
              {categories.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#FFFFFF', color: '#111827', border: '1px solid rgba(17,24,39,0.1)', borderRadius: 16 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Savings Trend">
        <AreaSeries data={cashflow} dataKey="savings" color="#16A34A" />
      </ChartShell>
      <ChartShell title="Debt Payoff Progress">
        <AreaSeries data={cashflow} dataKey="debt" color="#DC2626" />
      </ChartShell>
    </div>
  )
}

function AreaSeries({ data, dataKey, color }: { data: MoneyPoint[]; dataKey: 'savings' | 'debt'; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={dataKey} x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.45} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip contentStyle={{ background: '#FFFFFF', color: '#111827', border: '1px solid rgba(17,24,39,0.1)', borderRadius: 16 }} />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#${dataKey})`} strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function ChartShell({ title, className = '', children }: PropsWithChildren<{ title: string; className?: string }>) {
  return (
    <GlassCard className={`min-w-0 p-4 sm:p-5 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-[#111827]">{title}</h3>
      {children}
    </GlassCard>
  )
}
