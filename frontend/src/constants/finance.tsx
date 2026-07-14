import {
  BadgeIndianRupee,
  Banknote,
  CalendarDays,
  FileText,
  Gauge,
  Landmark,
  PiggyBank,
  ReceiptText,
  ShoppingBag,
  Target,
  WalletCards,
} from 'lucide-react'
import type { FinanceRecord, ModuleConfig, NavItem } from '../types/finance'
import { currency } from '../utils/format'

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: Gauge },
  { label: 'Monthly Income', path: '/income', icon: Banknote },
  { label: 'Monthly Expenses', path: '/monthly-expenses', icon: ReceiptText },
  { label: 'Daily Expenses', path: '/daily-expenses', icon: ShoppingBag },
  { label: 'All Expenses', path: '/expenses', icon: FileText },
  { label: 'Payment Planner', path: '/monthly-planner', icon: CalendarDays },
  { label: 'Loans', path: '/loans', icon: Landmark },
  { label: 'EMI Tracker', path: '/emis', icon: WalletCards },
  { label: 'Savings', path: '/savings', icon: PiggyBank },
  { label: 'Purchases', path: '/purchases', icon: Target },
  { label: 'Reports', path: '/reports', icon: FileText },
]

const amountColumn = { key: 'amount', header: 'Amount', render: (row: FinanceRecord) => currency(Number(row.amount ?? 0)) }
const statusColumn = { key: 'status', header: 'Status' }

export const modules: Record<string, ModuleConfig<FinanceRecord>> = {
  income: {
    title: 'Monthly Income',
    subtitle: 'Add salary, freelance income, refunds, and other money received each month.',
    endpoint: '/income',
    icon: Banknote,
    accent: 'from-[#2A9D8F] to-[#111827]',
    fields: [
      { name: 'source_name', label: 'Income source' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'received_date', label: 'Received date', type: 'date' },
      { name: 'income_type', label: 'Type', type: 'select', options: ['Salary', 'Freelance', 'Refund', 'Interest', 'Gift', 'Other'] },
      { name: 'status', label: 'Status', type: 'select', options: ['Paid', 'Overdue'] },
      { name: 'recurring', label: 'Monthly recurring', type: 'checkbox' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: 'source_name', header: 'Source' }, amountColumn, { key: 'income_type', header: 'Type' }, statusColumn, { key: 'received_date', header: 'Date' }],
    seed: [
      { id: 'inc-1', source_name: 'Salary', amount: 92000, income_type: 'Salary', status: 'Paid', received_date: '2026-07-01', recurring: true },
      { id: 'inc-2', source_name: 'Interest Credit', amount: 1400, income_type: 'Interest', status: 'Overdue', received_date: '2026-07-03', recurring: false },
    ],
  },
  'monthly-expenses': {
    title: 'Monthly Expenses',
    subtitle: 'Add fixed or recurring expenses like rent, bills, groceries, petrol, and subscriptions.',
    endpoint: '/expenses',
    icon: ReceiptText,
    accent: 'from-[#E76F51] to-[#DC2626]',
    fields: [
      { name: 'expense_name', label: 'Expense name' },
      { name: 'category', label: 'Category', type: 'select', options: ['Rent', 'Bills', 'Groceries', 'Petrol', 'Subscription', 'Medical', 'Education', 'Other'] },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'due_date', label: 'Due date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'Paid', 'Unpaid', 'Overdue'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: 'expense_name', header: 'Expense' }, { key: 'category', header: 'Category' }, amountColumn, statusColumn],
    seed: [
      { id: 'mexp-1', expense_name: 'Rent', category: 'Rent', amount: 11000, due_date: '2026-07-05', status: 'Paid', recurring: true },
      { id: 'mexp-2', expense_name: 'Groceries', category: 'Groceries', amount: 8000, due_date: '2026-07-08', status: 'Planned', recurring: true },
    ],
  },
  'daily-expenses': {
    title: 'Daily Expenses',
    subtitle: 'Quickly add daily spending for food, travel, shopping, petrol, and small purchases.',
    endpoint: '/expenses',
    icon: ShoppingBag,
    accent: 'from-[#E9C46A] to-[#E76F51]',
    fields: [
      { name: 'expense_name', label: 'Spent on' },
      { name: 'category', label: 'Category', type: 'select', options: ['Food', 'Travel', 'Petrol', 'Shopping', 'Tea/Snacks', 'Entertainment', 'Other'] },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'due_date', label: 'Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Paid', 'Planned'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: 'expense_name', header: 'Spent on' }, { key: 'category', header: 'Category' }, amountColumn, { key: 'due_date', header: 'Date' }],
    seed: [
      { id: 'dexp-1', expense_name: 'Lunch', category: 'Food', amount: 180, due_date: '2026-07-05', status: 'Paid', recurring: false },
      { id: 'dexp-2', expense_name: 'Petrol', category: 'Petrol', amount: 500, due_date: '2026-07-05', status: 'Paid', recurring: false },
    ],
  },
  expenses: {
    title: 'All Expenses',
    subtitle: 'Track every paid, unpaid, planned, and overdue expense in one place.',
    endpoint: '/expenses',
    icon: FileText,
    accent: 'from-[#111827] to-[#E76F51]',
    fields: [
      { name: 'expense_name', label: 'Expense name' },
      { name: 'category', label: 'Category', type: 'select', options: ['Rent', 'EMI', 'Loan', 'Food', 'Petrol', 'Shopping', 'Travel', 'Bills', 'Savings', 'Other'] },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'due_date', label: 'Date or due date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'Paid', 'Unpaid', 'Overdue'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: 'expense_name', header: 'Expense' }, { key: 'category', header: 'Category' }, amountColumn, statusColumn],
    seed: [
      { id: 'exp-1', expense_name: 'Rent', category: 'Rent', amount: 11000, due_date: '2026-07-05', status: 'Paid', recurring: true },
      { id: 'exp-2', expense_name: 'Slice payment', category: 'Loan', amount: 29000, due_date: '2026-07-12', status: 'Planned', recurring: true },
      { id: 'exp-3', expense_name: 'Lunch', category: 'Food', amount: 180, due_date: '2026-07-05', status: 'Paid', recurring: false },
    ],
  },
  loans: {
    title: 'Loans',
    subtitle: 'Track loan amount, lender, EMI, outstanding balance, and status.',
    endpoint: '/loans',
    icon: Landmark,
    accent: 'from-[#111827] to-[#E76F51]',
    fields: [
      { name: 'loan_name', label: 'Loan name' },
      { name: 'lender_name', label: 'Lender' },
      { name: 'loan_type', label: 'Loan type', type: 'select', options: ['Personal Loan', 'Bike Loan', 'Home Loan', 'Car Loan', 'Education Loan', 'Friend/Family Loan', 'Other'] },
      { name: 'total_loan_amount', label: 'Total loan', type: 'number' },
      { name: 'emi_amount', label: 'EMI amount', type: 'number' },
      { name: 'outstanding_amount', label: 'Outstanding', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Closed', 'Paused'] },
    ],
    columns: [{ key: 'loan_name', header: 'Loan' }, { key: 'lender_name', header: 'Lender' }, { key: 'outstanding_amount', header: 'Outstanding', render: (row) => currency(Number(row.outstanding_amount ?? 0)) }, statusColumn],
    seed: [
      { id: 'loan-1', loan_name: 'Slice', lender_name: 'Slice', loan_type: 'Personal Loan', total_loan_amount: 102369, emi_amount: 18000, outstanding_amount: 45869, status: 'Active' },
      { id: 'loan-2', loan_name: 'Bike Loan', lender_name: 'HDFC', loan_type: 'Bike Loan', total_loan_amount: 90000, emi_amount: 5000, outstanding_amount: 45000, status: 'Active' },
    ],
  },
  emis: {
    title: 'EMI Tracker',
    subtitle: 'Track upcoming, paid, and overdue EMI payments.',
    endpoint: '/emis',
    icon: WalletCards,
    accent: 'from-[#E9C46A] to-[#E76F51]',
    fields: [
      { name: 'emi_name', label: 'EMI Tracker' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'due_date', label: 'Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Upcoming', 'Paid', 'Overdue'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: 'emi_name', header: 'Name' }, amountColumn, { key: 'due_date', header: 'Date' }, statusColumn],
    seed: [
      { id: 'emis-1', emi_name: 'Slice EMI', amount: 18000, due_date: '2026-09-30', status: 'Upcoming' },
      { id: 'emis-2', emi_name: 'Bike EMI', amount: 5000, due_date: '2026-07-05', status: 'Paid' },
      { id: 'emis-3', emi_name: 'Phone EMI', amount: 3200, due_date: '2026-07-01', status: 'Overdue' },
    ],
  },
  savings: makeSimpleModule('Savings', '/goals', PiggyBank, 'from-[#2A9D8F] to-[#111827]', 'See current savings and plan small savings targets.', 'goal_name', 'Emergency fund'),
  purchases: makeSimpleModule('Purchase Planner', '/wishlist', Target, 'from-[#111827] to-[#2A9D8F]', 'Plan upcoming purchases and the monthly saving needed for each item.', 'item_name', 'New phone'),
}

function makeSimpleModule(title: string, endpoint: string, icon: ModuleConfig<FinanceRecord>['icon'], accent: string, subtitle: string, nameKey: string, seedName: string): ModuleConfig<FinanceRecord> {
  return {
    title,
    subtitle,
    endpoint,
    icon,
    accent,
    fields: [
      { name: nameKey, label: title },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'due_date', label: 'Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'Active', 'Paid', 'Completed'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [{ key: nameKey, header: 'Name' }, amountColumn, { key: 'due_date', header: 'Date' }, statusColumn],
    seed: [{ id: `${endpoint.slice(1)}-1`, [nameKey]: seedName, amount: 50000, due_date: '2026-09-30', status: 'Active' }],
  }
}

export const dashboardStats = [
  { label: 'Remaining Balance', value: 12400, icon: BadgeIndianRupee, accent: 'from-[#111827] to-[#2A9D8F]' },
  { label: 'Monthly Income', value: 93400, icon: Banknote, accent: 'from-[#2A9D8F] to-[#111827]' },
  { label: 'Monthly Expenses', value: 81000, icon: ReceiptText, accent: 'from-[#E76F51] to-[#DC2626]' },
  { label: 'Savings', value: 12400, icon: PiggyBank, accent: 'from-[#16A34A] to-[#2A9D8F]' },
  { label: 'Loan Balance', value: 90869, icon: Landmark, accent: 'from-[#111827] to-[#E76F51]' },
  { label: 'Upcoming EMI', value: 18000, icon: WalletCards, accent: 'from-[#E9C46A] to-[#E76F51]' },
]

export const cashflow = [
  { name: 'May', income: 76000, expenses: 62000, savings: 14000, debt: 130000 },
  { name: 'Jun', income: 88000, expenses: 70500, savings: 17500, debt: 114000 },
  { name: 'Jul', income: 93400, expenses: 81000, savings: 12400, debt: 90869 },
  { name: 'Aug', income: 92000, expenses: 84000, savings: 8000, debt: 63869 },
  { name: 'Sep', income: 92000, expenses: 69500, savings: 22500, debt: 45869 },
]

export const categoryBreakdown = [
  { name: 'Loans/EMIs', value: 34000 },
  { name: 'Rent', value: 11000 },
  { name: 'Food', value: 10000 },
  { name: 'Bills', value: 8000 },
  { name: 'Daily spend', value: 6000 },
]

export const monthlyPlans = [
  { month: 'July 2026', income: 93400, items: [['Rent', 11000], ['Bike EMI', 5000], ['Slice payment', 29000], ['Groceries', 8000], ['Bills', 6000], ['Daily expenses', 12000], ['Savings', 12400]] },
  { month: 'August 2026', income: 92000, items: [['Rent', 12500], ['Slice payment', 27500], ['Groceries', 9000], ['Bills', 6000], ['Daily expenses', 14000], ['Savings', 8000]] },
  { month: 'September 2026', income: 92000, items: [['Rent', 12500], ['Slice EMI', 18000], ['Groceries', 9000], ['Bills', 6000], ['Daily expenses', 14000], ['Savings', 22500]] },
] as const
