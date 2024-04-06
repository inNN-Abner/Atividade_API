import { Router } from 'express'
import TelephoneController from '../../controllers/telephone/telephone.controller'
import authMiddleware from '../../middlewares/auth.middlewares'

const telephoneRoutes = Router()

telephoneRoutes.get('/', authMiddleware, TelephoneController.index)
telephoneRoutes.get('/:id', authMiddleware, TelephoneController.show)
telephoneRoutes.post('/', authMiddleware, TelephoneController.store)
telephoneRoutes.put('/:id', authMiddleware, TelephoneController.update)
telephoneRoutes.delete('/:id', authMiddleware, TelephoneController.delete)

export default telephoneRoutes