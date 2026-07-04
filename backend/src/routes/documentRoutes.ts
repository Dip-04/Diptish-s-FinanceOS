import multer from 'multer'
import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { ResourceService } from '../services/resourceService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const upload = multer({ storage: multer.memoryStorage() })
export const documentRoutes = Router()
const service = new ResourceService('documents')

documentRoutes.get('/', asyncHandler(async (_req, res) => res.json(await service.list())))
documentRoutes.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  const file = req.file
  const record = await service.create({
    id: randomUUID(),
    document_name: req.body.document_name ?? file?.originalname ?? 'Untitled document',
    category: req.body.category ?? 'Other',
    linked_module: req.body.linked_module ?? null,
    file_url: file ? `local://${file.originalname}` : req.body.file_url,
    uploaded_date: new Date().toISOString(),
  })
  res.status(201).json(record)
}))
documentRoutes.delete('/:id', asyncHandler(async (req, res) => res.json(await service.remove(String(req.params.id)))))
