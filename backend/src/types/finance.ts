export type FinanceRecord = Record<string, unknown> & { id?: string }

export type ResourceName =
  | 'income_sources'
  | 'expenses'
  | 'monthly_plans'
  | 'loans'
  | 'emi_payments'
  | 'savings_goals'
  | 'wishlist_items'
