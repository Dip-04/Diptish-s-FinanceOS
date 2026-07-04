import { Router } from 'express'
import { resourceController } from '../controllers/resourceController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import type { ResourceName } from '../types/finance.js'

export function crudRoutes(resource: ResourceName) {
  const router = Router()
  const controller = resourceController(resource)

  router.get('/', asyncHandler(controller.list))
  router.post('/', asyncHandler(controller.create))
  router.put('/:id', asyncHandler(controller.update))
  router.delete('/:id', asyncHandler(controller.remove))

  return router
}
