import {
  BadgeIndianRupee,
  Banknote,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  CreditCard,
  FileScan,
  FileText,
  Gauge,
  HeartPulse,
  Landmark,
  MessageCircle,
  Mic,
  Moon,
  PiggyBank,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WalletCards,
  Wifi,
} from 'lucide-react'
import type { FinanceRecord, ModuleConfig, NavItem } from '../types/finance'
import { currency } from '../utils/format'

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: Gauge },
  { label: 'Income', path: '/income', icon: Banknote },
  { label: 'Expenses', path: '/expenses', icon: ReceiptText },
  { label: 'Monthly Planner', path: '/monthly-planner', icon: CalendarDays },
  { label: 'Loans', path: '/loans', icon: Landmark },
  { label: 'EMI Tracker', path: '/emis', icon: WalletCards },
  { label: 'Credit Cards', path: '/credit-cards', icon: CreditCard },
  { label: 'Savings Goals', path: '/goals', icon: Target },
  { label: 'Wishlist', path: '/wishlist', icon: Sparkles },
  { label: 'Investments', path: '/investments', icon: ChartNoAxesCombined },
  { label: 'Insurance', path: '/insurance', icon: ShieldCheck },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'AI Advisor', path: '/ai-advisor', icon: Bot },
  { label: 'AI Tax Planner', path: '/ai-tax-planner', icon: Landmark },
  { label: 'AI Investments', path: '/ai-investments', icon: ChartNoAxesCombined },
  { label: 'Monthly Coach', path: '/ai-coach', icon: Sparkles },
  { label: 'Documents', path: '/documents', icon: BriefcaseBusiness },
  { label: 'OCR Scanner', path: '/ocr', icon: FileScan },
  { label: 'UPI SMS', path: '/upi-sms', icon: MessageCircle },
  { label: 'WhatsApp', path: '/whatsapp-reminders', icon: Bell },
  { label: 'Voice Entry', path: '/voice-entry', icon: Mic },
  { label: 'Family Budget', path: '/family-budget', icon: Users },
  { label: 'Multi-Currency', path: '/multi-currency', icon: Wifi },
  { label: 'Offline Sync', path: '/offline-sync', icon: Moon },
  { label: 'Settings', path: '/settings', icon: Settings },
]

const statusColumn = { key: 'status', header: 'Status' }
const amountColumn = { key: 'amount', header: 'Amount', render: (row: FinanceRecord) => currency(Number(row.amount ?? 0)) }

export const modules: Record<string, ModuleConfig<FinanceRecord>> = {
  income: {
    title: 'Income Management',
    subtitle: 'Track salary, freelance, business, bonuses, interest, dividends, gifts, and refunds.',
    endpoint: '/income',
    icon: Banknote,
    accent: 'from-[#2A9D8F] to-[#111827]',
    fields: [
      { name: 'source_name', label: 'Source name' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'received_date', label: 'Received date', type: 'date' },
      { name: 'income_type', label: 'Income type', type: 'select', options: ['Salary', 'Freelance', 'Business', 'Bonus', 'Refund', 'Interest', 'Dividend', 'Gift', 'Other'] },
      { name: 'recurring', label: 'Recurring', type: 'checkbox' },
      { name: 'taxable', label: 'Taxable', type: 'checkbox' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: 'source_name', header: 'Source' }, amountColumn, { key: 'income_type', header: 'Type' }, { key: 'received_date', header: 'Date' }],
    seed: [
      { id: 'inc-1', source_name: 'Salary', amount: 92000, income_type: 'Salary', received_date: '2026-07-01', recurring: true, taxable: true },
      { id: 'inc-2', source_name: 'Interest Credit', amount: 1400, income_type: 'Interest', received_date: '2026-07-03', recurring: false, taxable: true },
    ],
  },
  expenses: {
    title: 'Expense Management',
    subtitle: 'Control every rupee across fixed, variable, recurring, and one-time expenses.',
    endpoint: '/expenses',
    icon: ReceiptText,
    accent: 'from-[#E76F51] to-[#DC2626]',
    fields: [
      { name: 'expense_name', label: 'Expense name' },
      { name: 'category', label: 'Category', type: 'select', options: ['Rent', 'EMI', 'Loan', 'Food', 'Petrol', 'Shopping', 'Travel', 'Gym', 'Medical', 'Family', 'Bills', 'Insurance', 'Education', 'Entertainment', 'Savings', 'Other'] },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'due_date', label: 'Due date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'Paid', 'Unpaid', 'Overdue'] },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: 'expense_name', header: 'Expense' }, { key: 'category', header: 'Category' }, amountColumn, statusColumn],
    seed: [
      { id: 'exp-1', expense_name: 'Rent', category: 'Rent', amount: 11000, due_date: '2026-07-05', status: 'Paid', priority: 'Critical' },
      { id: 'exp-2', expense_name: 'Slice', category: 'Loan', amount: 29000, due_date: '2026-07-12', status: 'Planned', priority: 'High' },
    ],
  },
  loans: {
    title: 'Loan Management',
    subtitle: 'Analyze loans, prepayments, interest pressure, and the best debt to close first.',
    endpoint: '/loans',
    icon: Landmark,
    accent: 'from-[#111827] to-[#E76F51]',
    fields: [
      { name: 'loan_name', label: 'Loan name' },
      { name: 'lender_name', label: 'Lender' },
      { name: 'loan_type', label: 'Loan type', type: 'select', options: ['Personal Loan', 'Bike Loan', 'Home Loan', 'Car Loan', 'Education Loan', 'Gold Loan', 'Credit Card Loan', 'BNPL', 'Friend Loan', 'Family Loan', 'Other'] },
      { name: 'total_loan_amount', label: 'Total loan', type: 'number' },
      { name: 'interest_rate', label: 'Interest rate', type: 'number' },
      { name: 'emi_amount', label: 'EMI amount', type: 'number' },
      { name: 'outstanding_amount', label: 'Outstanding', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Closed', 'Paused'] },
    ],
    columns: [{ key: 'loan_name', header: 'Loan' }, { key: 'lender_name', header: 'Lender' }, { key: 'outstanding_amount', header: 'Outstanding', render: (row) => currency(Number(row.outstanding_amount ?? 0)) }, { key: 'interest_rate', header: 'Rate' }],
    seed: [
      { id: 'loan-1', loan_name: 'Slice', lender_name: 'Slice', loan_type: 'BNPL', total_loan_amount: 102369, interest_rate: 22, emi_amount: 18000, outstanding_amount: 45869, status: 'Active' },
      { id: 'loan-2', loan_name: 'Bike Loan', lender_name: 'HDFC', loan_type: 'Bike Loan', total_loan_amount: 90000, interest_rate: 12.5, emi_amount: 5000, outstanding_amount: 45000, status: 'Active' },
    ],
  },
  emis: makeModule('EMI Tracker', '/emis', WalletCards, 'from-[#E9C46A] to-[#E76F51]', 'Track upcoming, paid, missed, penalty, and completion status for every EMI.', 'emi_name'),
  'credit-cards': makeModule('Credit Card Manager', '/credit-cards', CreditCard, 'from-[#111827] to-[#2A9D8F]', 'Monitor limits, billing dates, due amounts, minimum due, interest, and rewards.', 'card_name'),
  goals: makeModule('Savings Goals', '/goals', Target, 'from-[#2A9D8F] to-[#111827]', 'Plan iPhone, bike, trip, emergency fund, house, and investment goals.', 'goal_name'),
  wishlist: makeModule('Wishlist Planner', '/wishlist', Sparkles, 'from-[#E76F51] to-[#E9C46A]', 'Calculate affordable dates, monthly saving required, and purchase priority.', 'item_name'),
  investments: makeModule('Investment Tracker', '/investments', ChartNoAxesCombined, 'from-[#2A9D8F] to-[#111827]', 'Track FD, RD, mutual funds, stocks, gold, crypto, PPF, NPS, EPF, and real estate.', 'investment_name'),
  insurance: makeModule('Insurance Tracker', '/insurance', ShieldCheck, 'from-[#E9C46A] to-[#E76F51]', 'Manage health, life, vehicle, travel policies, premiums, coverage, and renewals.', 'policy_name'),
}

function makeModule(title: string, endpoint: string, icon: ModuleConfig<FinanceRecord>['icon'], accent: string, subtitle: string, nameKey: string): ModuleConfig<FinanceRecord> {
  return {
    title,
    subtitle,
    endpoint,
    icon,
    accent,
    fields: [
      { name: nameKey, label: title.replace(' Tracker', '').replace(' Manager', '').replace(' Planner', '') },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'due_date', label: 'Due date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Planned', 'Paid', 'Completed', 'Watch'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: nameKey, header: 'Name' }, amountColumn, { key: 'due_date', header: 'Date' }, statusColumn],
    seed: [{ id: `${endpoint.slice(1)}-1`, [nameKey]: title.includes('Credit') ? 'HDFC Millennia' : title.includes('Goal') ? 'Emergency Fund' : title.includes('Wishlist') ? 'iPhone 17 Pro' : title, amount: 50000, due_date: '2026-09-30', status: 'Active' }],
  }
}

export const dashboardStats = [
  { label: 'Total Balance', value: 12400, icon: BadgeIndianRupee, accent: 'from-[#111827] to-[#2A9D8F]' },
  { label: 'Monthly Income', value: 92000, icon: Banknote, accent: 'from-[#2A9D8F] to-[#111827]' },
  { label: 'Monthly Expenses', value: 90000, icon: ReceiptText, accent: 'from-[#E76F51] to-[#DC2626]' },
  { label: 'Savings', value: 2000, icon: PiggyBank, accent: 'from-[#16A34A] to-[#2A9D8F]' },
  { label: 'Total Debt', value: 45869, icon: Landmark, accent: 'from-[#111827] to-[#E76F51]' },
  { label: 'Net Worth', value: 218000, icon: Building2, accent: 'from-[#2A9D8F] to-[#E9C46A]' },
  { label: 'Upcoming EMI', value: 18000, icon: WalletCards, accent: 'from-[#E9C46A] to-[#E76F51]' },
  { label: 'Health Score', value: 74, icon: HeartPulse, accent: 'from-[#111827] to-[#2A9D8F]', suffix: '/100' },
]

export const cashflow = [
  { name: 'May', income: 76000, expenses: 62000, savings: 14000, debt: 130000, netWorth: 178000 },
  { name: 'Jun', income: 88000, expenses: 70500, savings: 17500, debt: 114000, netWorth: 198000 },
  { name: 'Jul', income: 92000, expenses: 94000, savings: 2000, debt: 73369, netWorth: 218000 },
  { name: 'Aug', income: 92000, expenses: 92000, savings: 0, debt: 45869, netWorth: 227000 },
  { name: 'Sep', income: 52000, expenses: 44500, savings: 7500, debt: 27869, netWorth: 241000 },
]

export const categoryBreakdown = [
  { name: 'Loan', value: 34000 },
  { name: 'Family', value: 35000 },
  { name: 'Rent', value: 11000 },
  { name: 'Living', value: 12000 },
  { name: 'Savings', value: 2000 },
]

export const monthlyPlans = [
  { month: 'July 2026', income: 92000, items: [['Rent', 11000], ['Bike EMI', 5000], ['Tanu', 35000], ['Slice', 29000], ['Monthly expenses', 10000], ['Petrol', 2000], ['Savings', 2000]] },
  { month: 'August 2026', income: 92000, items: [['Rent', 12500], ['Mummy', 40000], ['Slice', 27500], ['Monthly expenses', 10000], ['Petrol', 2000], ['Savings', 0]] },
  { month: 'September 2026', income: 52000, items: [['Rent', 12500], ['Slice EMI', 18000], ['Monthly expenses', 10000], ['Petrol', 2000], ['Savings', 2000]] },
] as const
