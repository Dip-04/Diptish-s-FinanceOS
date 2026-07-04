import { ZodError } from 'zod';
function readErrorPayload(error) {
    return error && typeof error === 'object' ? error : {};
}
export function errorHandler(error, _req, res, _next) {
    if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    const payload = readErrorPayload(error);
    const status = typeof payload.status === 'number' && payload.status >= 400 ? payload.status : 500;
    const message = error instanceof Error
        ? error.message
        : typeof payload.message === 'string' && payload.message.trim()
            ? payload.message
            : typeof error === 'string' && error.trim()
                ? error
                : 'Unexpected server error';
    return res.status(status).json({
        message,
        ...(typeof payload.details === 'string' ? { details: payload.details } : {}),
        ...(typeof payload.hint === 'string' ? { hint: payload.hint } : {}),
        ...(typeof payload.code === 'string' ? { code: payload.code } : {}),
    });
}
