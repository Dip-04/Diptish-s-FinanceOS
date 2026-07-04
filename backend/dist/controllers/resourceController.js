import { z } from 'zod';
import { ResourceService } from '../services/resourceService.js';
const payloadSchema = z.record(z.string(), z.unknown());
export function resourceController(resource) {
    const service = new ResourceService(resource);
    return {
        list: async (_req, res) => res.json(await service.list()),
        create: async (req, res) => res.status(201).json(await service.create(payloadSchema.parse(req.body))),
        update: async (req, res) => res.json(await service.update(String(req.params.id), payloadSchema.parse(req.body))),
        remove: async (req, res) => res.json(await service.remove(String(req.params.id))),
    };
}
