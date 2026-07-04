import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

type ErrorPayload = {
  message?: unknown
  details?: unknown
  hint?: unknown
  code?: unknown
  status?: unknown
}

function readErrorPayload(error: unknown): ErrorPayload {
  return error && typeof error === 'object' ? error as ErrorPayload : {}
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Validation failed', issues: error.issues })
  }

  const payload = readErrorPayload(error)
  const status = typeof payload.status === 'number' && payload.status >= 400 ? payload.status : 500
  const message = error instanceof Error
    ? error.message
    : typeof payload.message === 'string' && payload.message.trim()
      ? payload.message
      : typeof error === 'string' && error.trim()
        ? error
        : 'Unexpected server error'

  return res.status(status).json({
    message,
    ...(typeof payload.details === 'string' ? { details: payload.details } : {}),
    ...(typeof payload.hint === 'string' ? { hint: payload.hint } : {}),
    ...(typeof payload.code === 'string' ? { code: payload.code } : {}),
  })
}
