create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  credit_score integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.income_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  source_name text not null,
  amount numeric(14,2) not null default 0,
  received_date date,
  month integer,
  year integer,
  income_type text,
  recurring boolean default false,
  taxable boolean default false,
  notes text,
  attachment_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  expense_name text not null,
  category text,
  amount numeric(14,2) not null default 0,
  month integer,
  year integer,
  due_date date,
  paid_date date,
  status text default 'Planned',
  priority text default 'Medium',
  mandatory boolean default true,
  recurring boolean default false,
  payment_mode text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.monthly_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  month integer not null,
  year integer not null,
  planned_income numeric(14,2) default 0,
  actual_income numeric(14,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, month, year)
);

create table if not exists public.monthly_plan_items (
  id uuid primary key default gen_random_uuid(),
  monthly_plan_id uuid references public.monthly_plans(id) on delete cascade,
  item_name text not null,
  planned_amount numeric(14,2) default 0,
  actual_amount numeric(14,2) default 0,
  item_type text default 'expense',
  status text default 'Unpaid',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  loan_name text not null,
  lender_name text,
  loan_type text,
  total_loan_amount numeric(14,2) default 0,
  principal_amount numeric(14,2) default 0,
  interest_rate numeric(6,2) default 0,
  processing_fee numeric(14,2) default 0,
  emi_amount numeric(14,2) default 0,
  emi_date integer,
  start_date date,
  end_date date,
  tenure_months integer,
  paid_amount numeric(14,2) default 0,
  outstanding_amount numeric(14,2) default 0,
  interest_paid numeric(14,2) default 0,
  remaining_interest numeric(14,2) default 0,
  prepayment_allowed boolean default true,
  foreclosure_charges numeric(14,2) default 0,
  status text default 'Active',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.emi_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  loan_id uuid references public.loans(id) on delete set null,
  emi_name text not null,
  amount numeric(14,2) default 0,
  due_date date,
  paid_status text default 'Unpaid',
  penalty_amount numeric(14,2) default 0,
  reminder_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  bank_name text,
  card_name text not null,
  credit_limit numeric(14,2) default 0,
  used_limit numeric(14,2) default 0,
  available_limit numeric(14,2) generated always as (credit_limit - used_limit) stored,
  billing_date integer,
  due_date integer,
  total_due numeric(14,2) default 0,
  minimum_due numeric(14,2) default 0,
  interest_rate numeric(6,2) default 0,
  reward_points integer default 0,
  status text default 'Active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  goal_name text not null,
  target_amount numeric(14,2) default 0,
  current_saved_amount numeric(14,2) default 0,
  deadline date,
  priority text default 'Medium',
  monthly_saving_required numeric(14,2) default 0,
  status text default 'Active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  item_name text not null,
  amount numeric(14,2) default 0,
  priority text default 'Medium',
  best_purchase_month text,
  monthly_saving_required numeric(14,2) default 0,
  status text default 'Planned',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  investment_name text not null,
  type text,
  invested_amount numeric(14,2) default 0,
  current_value numeric(14,2) default 0,
  profit_loss numeric(14,2) default 0,
  return_percentage numeric(8,2) default 0,
  maturity_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.insurance_policies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  policy_name text not null,
  provider text,
  premium numeric(14,2) default 0,
  coverage_amount numeric(14,2) default 0,
  renewal_date date,
  nominee text,
  document_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  document_name text not null,
  category text,
  linked_module text,
  file_url text,
  uploaded_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text,
  notification_type text,
  due_at timestamptz,
  read_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_income_user_date on public.income_sources(user_id, received_date);
create index if not exists idx_expenses_user_due on public.expenses(user_id, due_date);
create index if not exists idx_loans_user_status on public.loans(user_id, status);
create index if not exists idx_emis_user_due on public.emi_payments(user_id, due_date);
create index if not exists idx_documents_user_category on public.documents(user_id, category);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles','income_sources','expenses','monthly_plans','monthly_plan_items','loans','emi_payments','credit_cards','savings_goals','wishlist_items','investments','insurance_policies','documents','notifications']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create policy "Users can manage own income" on public.income_sources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own expenses" on public.expenses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own monthly plans" on public.monthly_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own loans" on public.loans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own emis" on public.emi_payments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own credit cards" on public.credit_cards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own goals" on public.savings_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own wishlist" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own investments" on public.investments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own insurance" on public.insurance_policies for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own documents" on public.documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own notifications" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
