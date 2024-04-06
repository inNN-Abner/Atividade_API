import { Router } from 'express';
import taskRoutes from './task/task.routes';
import authRoutes from './auth/auth.routes';
import documentsRoutes from './documents/documents.routes';
import telephoneRoutes from './telephone/telephone.routes';

const routes = Router();

routes.use('/task', taskRoutes)
routes.use('/auth', authRoutes)
routes.use('/documents', documentsRoutes)
routes.use('/telephone', telephoneRoutes) 

export default routes;