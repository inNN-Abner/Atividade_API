import { Router } from 'express'
import DocumentsController from '../../controllers/documents/documents.controller'
import authMiddleware from '../../middlewares/auth.middlewares'

const documentsRoutes = Router()

documentsRoutes.get('/', authMiddleware, DocumentsController.index)
documentsRoutes.get('/:id', authMiddleware, DocumentsController.show)
documentsRoutes.post('/', authMiddleware, DocumentsController.store)
documentsRoutes.put('/:id', authMiddleware, DocumentsController.update)
documentsRoutes.delete('/:id', authMiddleware, DocumentsController.delete)

export default documentsRoutes
