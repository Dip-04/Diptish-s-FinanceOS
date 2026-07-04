import type { Request, Response } from 'express'
import { z } from 'zod'
import { ResourceService } from '../services/resourceService.js'
import type { ResourceName } from '../types/finance.js'

const payloadSchema = z.record(z.string(), z.unknown())

export function resourceController(resource: ResourceName) {
  const service = new ResourceService(resource)
  return {
    list: async (_req: Request, res: Response) => res.json(await service.list()),
    create: async (req: Request, res: Response) => res.status(201).json(await service.create(payloadSchema.parse(req.body))),
    update: async (req: Request, res: Response) => res.json(await service.update(String(req.params.id), payloadSchema.parse(req.body))),
    remove: async (req: Request, res: Response) => res.json(await service.remove(String(req.params.id))),
  }
}
