import { randomUUID } from 'node:crypto';
import { supabase } from '../config/supabase.js';
const memoryDb = new Map();
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
        const record = { id: payload.id ?? randomUUID(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
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
        if (supabase) {
            const { data, error } = await supabase.from(this.resource).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
            if (error)
                throw error;
            return data;
        }
        const rows = table(this.resource);
        const index = rows.findIndex((row) => row.id === id);
        if (index === -1)
            throw new Error('Record not found');
        rows[index] = { ...rows[index], ...payload, updated_at: new Date().toISOString() };
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
