insert into public.income_sources (source_name, amount, received_date, month, year, income_type, recurring, taxable)
values ('Salary', 92000, '2026-07-01', 7, 2026, 'Salary', true, true);

insert into public.expenses (expense_name, category, amount, month, year, due_date, status, priority)
values
  ('Rent', 'Rent', 11000, 7, 2026, '2026-07-05', 'Paid', 'Critical'),
  ('Bike EMI', 'EMI', 5000, 7, 2026, '2026-07-10', 'Paid', 'High'),
  ('Tanu', 'Family', 35000, 7, 2026, '2026-07-12', 'Planned', 'High'),
  ('Slice', 'Loan', 29000, 7, 2026, '2026-07-15', 'Planned', 'Critical'),
  ('Monthly expenses', 'Food', 10000, 7, 2026, '2026-07-20', 'Planned', 'Medium'),
  ('Petrol', 'Petrol', 2000, 7, 2026, '2026-07-21', 'Planned', 'Medium'),
  ('Savings', 'Savings', 2000, 7, 2026, '2026-07-25', 'Planned', 'High');

insert into public.loans (loan_name, lender_name, loan_type, total_loan_amount, interest_rate, emi_amount, outstanding_amount, status)
values
  ('Slice', 'Slice', 'BNPL', 56500, 22, 18000, 52000, 'Active'),
  ('Bike Loan', 'HDFC', 'Bike Loan', 90000, 12.5, 5000, 45000, 'Active');

insert into public.savings_goals (goal_name, target_amount, current_saved_amount, deadline, priority, monthly_saving_required, status)
values ('Emergency Fund', 300000, 70000, '2027-06-30', 'Critical', 19167, 'Active');
