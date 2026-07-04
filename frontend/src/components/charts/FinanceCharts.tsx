import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PropsWithChildren } from 'react'
import { categoryBreakdown, cashflow } from '../../constants/finance'
import { GlassCard } from '../ui/GlassCard'

const colors = ['#C6FF3D', '#FF6B6B', '#F5C76B', '#B76CFF', '#4ADE80']

export function ChartGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <ChartShell title="Income vs Expenses" className="xl:col-span-2">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cashflow}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip contentStyle={{ background: '#080B1F', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
            <Bar dataKey="income" fill="#C6FF3D" radius={[10, 10, 0, 0]} />
            <Bar dataKey="expenses" fill="#FF6B6B" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Spending Categories">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={68} outerRadius={100} paddingAngle={4}>
              {categoryBreakdown.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#080B1F', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Savings Trend">
        <AreaSeries dataKey="savings" color="#4ADE80" />
      </ChartShell>
      <ChartShell title="Debt Payoff Progress">
        <AreaSeries dataKey="debt" color="#FB3B5F" />
      </ChartShell>
      <ChartShell title="Net Worth Growth">
        <AreaSeries dataKey="netWorth" color="#C6FF3D" />
      </ChartShell>
    </div>
  )
}

function AreaSeries({ dataKey, color }: { dataKey: string; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={cashflow}>
        <defs>
          <linearGradient id={dataKey} x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.45} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#94A3B8" />
        <YAxis stroke="#94A3B8" />
        <Tooltip contentStyle={{ background: '#080B1F', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#${dataKey})`} strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function ChartShell({ title, className = '', children }: PropsWithChildren<{ title: string; className?: string }>) {
  return (
    <GlassCard className={`min-w-0 p-4 sm:p-5 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-slate-50">{title}</h3>
      {children}
    </GlassCard>
  )
}
