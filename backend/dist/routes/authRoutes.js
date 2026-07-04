import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const authSchema = z.object({ email: z.string().email(), password: z.string().min(6), fullName: z.string().optional() });
const resetPasswordSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const changePasswordSchema = z.object({ currentPassword: z.string().min(6), newPassword: z.string().min(6), email: z.string().email().optional() });
export const authRoutes = Router();
authRoutes.post('/register', asyncHandler(async (req, res) => {
    const payload = authSchema.parse(req.body);
    if (!supabase)
        return res.status(201).json({ user: { id: 'local-user', email: payload.email, fullName: payload.fullName }, mode: 'local' });
    const { data, error } = await supabase.auth.admin.createUser({ email: payload.email, password: payload.password, email_confirm: true, user_metadata: { full_name: payload.fullName } });
    if (error)
        throw error;
    return res.status(201).json(data);
}));
authRoutes.post('/login', asyncHandler(async (req, res) => {
    const payload = authSchema.pick({ email: true, password: true }).parse(req.body);
    if (!supabase)
        return res.json({ session: { access_token: 'local-dev-token' }, user: { email: payload.email } });
    const { data, error } = await supabase.auth.signInWithPassword(payload);
    if (error)
        throw error;
    return res.json(data);
}));
authRoutes.post('/logout', (_req, res) => res.json({ ok: true }));
authRoutes.post('/forgot-password', asyncHandler(async (req, res) => {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    if (!supabase)
        return res.json({ ok: true, mode: 'local', email });
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error)
        throw error;
    return res.json({ ok: true });
}));
authRoutes.post('/reset-password', asyncHandler(async (req, res) => {
    const payload = resetPasswordSchema.parse(req.body);
    if (!supabase)
        return res.json({ ok: true, mode: 'local', message: 'Password reset in local mode.', email: payload.email });
    return res.json({ ok: true, message: 'Use the Supabase password recovery link/session to finalize password reset securely.' });
}));
authRoutes.get('/profile', (_req, res) => res.json({ id: 'local-user', name: 'Diptish Gohane', email: 'diptish@example.com' }));
authRoutes.put('/profile', asyncHandler(async (req, res) => res.json({ id: 'local-user', ...req.body, updated_at: new Date().toISOString() })));
authRoutes.post('/change-password', asyncHandler(async (req, res) => {
    const payload = changePasswordSchema.parse(req.body);
    if (!supabase)
        return res.json({ ok: true, mode: 'local', message: 'Password changed in local mode.' });
    return res.json({ ok: true, message: 'Password change request validated. In production, update password with the active Supabase user session.' });
}));
