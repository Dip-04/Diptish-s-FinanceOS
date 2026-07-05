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
  phone text,
  email text,
  avatar_url text,
  monthly_salary numeric(14,2) default 0,
  default_budget numeric(14,2) default 0,
  financial_goal text,
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
  notes text,
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
  emi_amount numeric(14,2) default 0,
  emi_date integer,
  start_date date,
  end_date date,
  tenure_months integer,
  paid_amount numeric(14,2) default 0,
  outstanding_amount numeric(14,2) default 0,
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
  notes text,
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

create index if not exists idx_income_user_date on public.income_sources(user_id, received_date);
create index if not exists idx_expenses_user_due on public.expenses(user_id, due_date);
create index if not exists idx_loans_user_status on public.loans(user_id, status);
create index if not exists idx_emis_user_due on public.emi_payments(user_id, due_date);
create index if not exists idx_savings_user_status on public.savings_goals(user_id, status);
create index if not exists idx_wishlist_user_status on public.wishlist_items(user_id, status);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles','income_sources','expenses','monthly_plans','monthly_plan_items','loans','emi_payments','savings_goals','wishlist_items']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

drop policy if exists "Users can manage own profile" on public.profiles;
drop policy if exists "Users can manage own income" on public.income_sources;
drop policy if exists "Users can manage own expenses" on public.expenses;
drop policy if exists "Users can manage own monthly plans" on public.monthly_plans;
drop policy if exists "Users can manage own loans" on public.loans;
drop policy if exists "Users can manage own emis" on public.emi_payments;
drop policy if exists "Users can manage own goals" on public.savings_goals;
drop policy if exists "Users can manage own wishlist" on public.wishlist_items;

create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can manage own income" on public.income_sources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own expenses" on public.expenses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own monthly plans" on public.monthly_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own loans" on public.loans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own emis" on public.emi_payments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own goals" on public.savings_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own wishlist" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
