import { ZodError } from 'zod';
export function errorHandler(error, _req, res, _next) {
    if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Validation failed', issues: error.issues });
    }
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return res.status(500).json({ message });
}
