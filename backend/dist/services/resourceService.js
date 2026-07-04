import { randomUUID } from 'node:crypto';
import { supabase } from '../config/supabase.js';
const memoryDb = new Map();
const writableColumns = {
    income_sources: ['id', 'user_id', 'source_name', 'amount', 'received_date', 'month', 'year', 'income_type', 'recurring', 'taxable', 'notes', 'attachment_url'],
    expenses: ['id', 'user_id', 'expense_name', 'category', 'amount', 'month', 'year', 'due_date', 'paid_date', 'status', 'priority', 'mandatory', 'recurring', 'payment_mode', 'notes'],
    monthly_plans: ['id', 'user_id', 'month', 'year', 'planned_income', 'actual_income'],
    loans: ['id', 'user_id', 'loan_name', 'lender_name', 'loan_type', 'total_loan_amount', 'principal_amount', 'interest_rate', 'processing_fee', 'emi_amount', 'emi_date', 'start_date', 'end_date', 'tenure_months', 'paid_amount', 'outstanding_amount', 'interest_paid', 'remaining_interest', 'prepayment_allowed', 'foreclosure_charges', 'status', 'notes'],
    emi_payments: ['id', 'user_id', 'loan_id', 'emi_name', 'amount', 'due_date', 'paid_status', 'penalty_amount', 'reminder_date', 'notes'],
    credit_cards: ['id', 'user_id', 'bank_name', 'card_name', 'credit_limit', 'used_limit', 'billing_date', 'due_date', 'total_due', 'minimum_due', 'interest_rate', 'reward_points', 'status'],
    savings_goals: ['id', 'user_id', 'goal_name', 'target_amount', 'current_saved_amount', 'deadline', 'priority', 'monthly_saving_required', 'status'],
    wishlist_items: ['id', 'user_id', 'item_name', 'amount', 'priority', 'best_purchase_month', 'monthly_saving_required', 'status', 'notes'],
    investments: ['id', 'user_id', 'investment_name', 'type', 'invested_amount', 'current_value', 'profit_loss', 'return_percentage', 'maturity_date', 'notes'],
    insurance_policies: ['id', 'user_id', 'policy_name', 'provider', 'premium', 'coverage_amount', 'renewal_date', 'nominee', 'document_url', 'notes'],
    documents: ['id', 'user_id', 'document_name', 'category', 'linked_module', 'file_url', 'uploaded_date'],
    ocr_transactions: ['id', 'user_id', 'source_file', 'extracted_transactions', 'status'],
    reminders: ['id', 'user_id', 'reminder_type', 'title', 'due_at', 'channel', 'status', 'payload'],
    family_groups: ['id', 'user_id', 'group_name', 'monthly_budget'],
    family_members: ['id', 'family_group_id', 'user_id', 'member_name', 'email', 'role'],
    shared_budgets: ['id', 'family_group_id', 'user_id', 'budget_name', 'amount', 'spent_amount', 'month', 'year'],
    voice_commands: ['id', 'user_id', 'command', 'parsed', 'status'],
    notification_preferences: ['id', 'user_id', 'rent_due', 'emi_due', 'credit_card_due', 'insurance_renewal', 'whatsapp_enabled', 'push_enabled'],
    currencies: ['id', 'user_id', 'code', 'symbol', 'name', 'preferred'],
    sync_queue: ['id', 'user_id', 'operation', 'resource', 'payload', 'client_updated_at', 'synced_at', 'status'],
    notifications: ['id', 'user_id', 'title', 'message', 'notification_type', 'due_at', 'read_at'],
};
const fieldAliases = {
    emi_payments: { status: 'paid_status' },
    savings_goals: { amount: 'target_amount', due_date: 'deadline' },
    investments: { amount: 'invested_amount', due_date: 'maturity_date' },
    insurance_policies: { amount: 'premium', due_date: 'renewal_date' },
};
function cleanValue(value) {
    if (value === '' || value === undefined)
        return undefined;
    if (typeof value === 'number' && Number.isNaN(value))
        return undefined;
    return value;
}
function cleanColumnValue(resource, column, value) {
    const cleaned = cleanValue(value);
    if (cleaned === undefined)
        return undefined;
    if (resource === 'credit_cards' && column === 'due_date' && typeof cleaned === 'string') {
        if (cleaned.includes('-'))
            return undefined;
        const day = Number(cleaned);
        return Number.isInteger(day) ? day : undefined;
    }
    return cleaned;
}
function normalizePayload(resource, payload) {
    const allowed = new Set(writableColumns[resource]);
    const aliases = fieldAliases[resource] ?? {};
    const normalized = {};
    for (const [key, rawValue] of Object.entries(payload)) {
        const column = aliases[key] ?? key;
        const value = cleanColumnValue(resource, column, rawValue);
        if (value !== undefined && allowed.has(column)) {
            normalized[column] = value;
        }
    }
    return normalized;
}
function table(name) {
    const rows = memoryDb.get(name) ?? [];
    memoryDb.set(name, rows);
    return rows;
}
export class ResourceService {
    resource;
    constructor(resource) {
        this.resource = resource;
    }
    async list() {
        if (supabase) {
            const { data, error } = await supabase.from(this.resource).select('*').order('created_at', { ascending: false });
            if (error)
                throw error;
            return data ?? [];
        }
        return table(this.resource);
    }
    async create(payload) {
        const now = new Date().toISOString();
        const record = { id: payload.id ?? randomUUID(), ...normalizePayload(this.resource, payload), created_at: now, updated_at: now };
        if (supabase) {
            const { data, error } = await supabase.from(this.resource).insert(record).select('*').single();
            if (error)
                throw error;
            return data;
        }
        table(this.resource).unshift(record);
        return record;
    }
    async update(id, payload) {
        const updates = { ...normalizePayload(this.resource, payload), updated_at: new Date().toISOString() };
        if (supabase) {
            const { data, error } = await supabase.from(this.resource).update(updates).eq('id', id).select('*').single();
            if (error)
                throw error;
            return data;
        }
        const rows = table(this.resource);
        const index = rows.findIndex((row) => row.id === id);
        if (index === -1)
            throw new Error('Record not found');
        rows[index] = { ...rows[index], ...updates };
        return rows[index];
    }
    async remove(id) {
        if (supabase) {
            const { error } = await supabase.from(this.resource).delete().eq('id', id);
            if (error)
                throw error;
            return { id };
        }
        memoryDb.set(this.resource, table(this.resource).filter((row) => row.id !== id));
        return { id };
    }
}
