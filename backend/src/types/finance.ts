export type FinanceRecord = Record<string, unknown> & { id?: string }

export type ResourceName =
  | 'income_sources'
  | 'expenses'
  | 'monthly_plans'
  | 'loans'
  | 'emi_payments'
  | 'credit_cards'
  | 'savings_goals'
  | 'wishlist_items'
  | 'investments'
  | 'insurance_policies'
  | 'documents'
  | 'notifications'
