import { Router } from 'express'
import TaskController from '../../controllers/telephone/telephone.controller'
import authMiddleware from '../../middlewares/auth.middlewares'

const taskRoutes = Router()

taskRoutes.get('/', authMiddleware, TaskController.index)
taskRoutes.get('/:id', authMiddleware, TaskController.show)
taskRoutes.post('/', authMiddleware, TaskController.store)
taskRoutes.put('/:id', authMiddleware, TaskController.update)
taskRoutes.delete('/:id', authMiddleware, TaskController.delete)

export default taskRoutes