import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';
const demoUser = {
    fullName: 'Diptish Gohane',
    email: 'diptishgohane04@gmail.com',
    password: 'Dipking@04',
    phone: '+918261950281',
    monthlySalary: 92000,
    defaultBudget: 50000,
    financialGoal: 'Become debt free and build wealth',
};
async function seedAuth() {
    if (!supabase || !env.supabaseUrl || !env.supabaseServiceRoleKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    }
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError)
        throw listError;
    const existing = existingUsers.users.find((user) => user.email?.toLowerCase() === demoUser.email);
    const authResult = existing
        ? await supabase.auth.admin.updateUserById(existing.id, {
            password: demoUser.password,
            email_confirm: true,
            phone_confirm: true,
            user_metadata: { full_name: demoUser.fullName, phone: demoUser.phone },
        })
        : await supabase.auth.admin.createUser({
            email: demoUser.email,
            password: demoUser.password,
            email_confirm: true,
            phone: demoUser.phone,
            phone_confirm: true,
            user_metadata: { full_name: demoUser.fullName, phone: demoUser.phone },
        });
    if (authResult.error)
        throw authResult.error;
    const user = authResult.data.user;
    if (!user)
        throw new Error('Supabase did not return a user');
    const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: demoUser.fullName,
        email: demoUser.email,
        phone: demoUser.phone,
        monthly_salary: demoUser.monthlySalary,
        default_budget: demoUser.defaultBudget,
        financial_goal: demoUser.financialGoal,
        updated_at: new Date().toISOString(),
    });
    if (profileError)
        throw profileError;
    await seedFinanceData(user.id);
    console.log('Auth seed complete');
    console.log(`Email: ${demoUser.email}`);
    console.log(`Password: ${demoUser.password}`);
}
async function seedFinanceData(userId) {
    await resetDemoFinanceData(userId);
    const { error: incomeError } = await supabase.from('income_sources').insert([
        { user_id: userId, source_name: 'Salary', amount: 92000, received_date: '2026-07-01', month: 7, year: 2026, income_type: 'Salary', recurring: true, taxable: true },
        { user_id: userId, source_name: 'Salary', amount: 92000, received_date: '2026-08-01', month: 8, year: 2026, income_type: 'Salary', recurring: true, taxable: true },
        { user_id: userId, source_name: 'Salary', amount: 52000, received_date: '2026-09-01', month: 9, year: 2026, income_type: 'Salary', recurring: true, taxable: true },
    ]);
    if (incomeError)
        console.warn(`Income seed skipped: ${incomeError.message}`);
    const expenses = [
        ['Rent', 'Rent', 11000, 7, '2026-07-05', 'Paid', 'Critical'],
        ['Bike EMI', 'EMI', 5000, 7, '2026-07-10', 'Paid', 'High'],
        ['Home support', 'Bills', 35000, 7, '2026-07-12', 'Planned', 'High'],
        ['Slice', 'Loan', 29000, 7, '2026-07-15', 'Planned', 'Critical'],
        ['Monthly expenses', 'Food', 10000, 7, '2026-07-20', 'Planned', 'Medium'],
        ['Petrol', 'Petrol', 2000, 7, '2026-07-21', 'Planned', 'Medium'],
        ['Savings', 'Savings', 2000, 7, '2026-07-25', 'Planned', 'High'],
        ['Rent', 'Rent', 12500, 8, '2026-08-05', 'Planned', 'Critical'],
        ['Home support', 'Bills', 40000, 8, '2026-08-12', 'Planned', 'High'],
        ['Slice', 'Loan', 27500, 8, '2026-08-15', 'Planned', 'Critical'],
        ['Monthly expenses', 'Food', 10000, 8, '2026-08-20', 'Planned', 'Medium'],
        ['Petrol', 'Petrol', 2000, 8, '2026-08-21', 'Planned', 'Medium'],
        ['Rent', 'Rent', 12500, 9, '2026-09-05', 'Planned', 'Critical'],
        ['Slice EMI', 'EMI', 18000, 9, '2026-09-15', 'Planned', 'Critical'],
        ['Monthly expenses', 'Food', 10000, 9, '2026-09-20', 'Planned', 'Medium'],
        ['Petrol', 'Petrol', 2000, 9, '2026-09-21', 'Planned', 'Medium'],
        ['Savings', 'Savings', 2000, 9, '2026-09-25', 'Planned', 'High'],
    ].map(([expense_name, category, amount, month, due_date, status, priority]) => ({
        user_id: userId,
        expense_name,
        category,
        amount,
        month,
        year: 2026,
        due_date,
        status,
        priority,
    }));
    const { error: expenseError } = await supabase.from('expenses').insert(expenses);
    if (expenseError)
        console.warn(`Expense seed skipped: ${expenseError.message}`);
    const { error: loanError } = await supabase.from('loans').insert([
        { user_id: userId, loan_name: 'Slice', lender_name: 'Slice', loan_type: 'BNPL', total_loan_amount: 102369, interest_rate: 22, emi_amount: 18000, outstanding_amount: 45869, status: 'Active', notes: 'July payment 29000, August payment 27500, EMI from September 18000' },
        { user_id: userId, loan_name: 'Bike Loan', lender_name: 'HDFC', loan_type: 'Bike Loan', total_loan_amount: 90000, interest_rate: 12.5, emi_amount: 5000, outstanding_amount: 45000, status: 'Active', notes: 'Bike EMI seed loan' },
    ]);
    if (loanError)
        console.warn(`Loan seed skipped: ${loanError.message}`);
    const { error: goalError } = await supabase.from('savings_goals').insert({
        user_id: userId,
        goal_name: 'Emergency Fund',
        target_amount: 300000,
        current_saved_amount: 70000,
        deadline: '2027-06-30',
        priority: 'Critical',
        monthly_saving_required: 19167,
        status: 'Active',
    });
    if (goalError)
        console.warn(`Goal seed skipped: ${goalError.message}`);
    await seedMonthlyPlans(userId);
}
async function resetDemoFinanceData(userId) {
    const tables = ['savings_goals', 'loans', 'expenses', 'income_sources'];
    for (const table of tables) {
        const { error } = await supabase.from(table).delete().eq('user_id', userId);
        if (error)
            console.warn(`${table} reset skipped: ${error.message}`);
    }
    const { data: plans } = await supabase.from('monthly_plans').select('id').eq('user_id', userId);
    const planIds = plans?.map((plan) => plan.id) ?? [];
    if (planIds.length) {
        await supabase.from('monthly_plan_items').delete().in('monthly_plan_id', planIds);
        await supabase.from('monthly_plans').delete().eq('user_id', userId);
    }
}
async function seedMonthlyPlans(userId) {
    const plans = [
        { month: 7, year: 2026, income: 92000, items: [['Rent', 11000], ['Bike EMI', 5000], ['Home support', 35000], ['Slice', 29000], ['Monthly expenses', 10000], ['Petrol', 2000], ['Savings', 2000]] },
        { month: 8, year: 2026, income: 92000, items: [['Rent', 12500], ['Home support', 40000], ['Slice', 27500], ['Monthly expenses', 10000], ['Petrol', 2000], ['Savings', 0]] },
        { month: 9, year: 2026, income: 52000, items: [['Rent', 12500], ['Slice EMI', 18000], ['Monthly expenses', 10000], ['Petrol', 2000], ['Savings', 2000]] },
    ];
    for (const plan of plans) {
        const { data: monthlyPlan, error: planError } = await supabase.from('monthly_plans').insert({
            user_id: userId,
            month: plan.month,
            year: plan.year,
            planned_income: plan.income,
            actual_income: plan.income,
        }).select('id').single();
        if (planError || !monthlyPlan) {
            console.warn(`Monthly plan seed skipped: ${planError?.message}`);
            continue;
        }
        const { error: itemError } = await supabase.from('monthly_plan_items').insert(plan.items.map(([item_name, amount]) => ({
            monthly_plan_id: monthlyPlan.id,
            item_name,
            planned_amount: amount,
            actual_amount: amount,
            item_type: item_name === 'Savings' ? 'saving' : 'expense',
            status: 'Planned',
        })));
        if (itemError)
            console.warn(`Monthly plan items seed skipped: ${itemError.message}`);
    }
}
seedAuth().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
