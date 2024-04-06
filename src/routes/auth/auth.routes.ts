import { Router } from 'express'
import AuthController from '../../controllers/auth/auth.controller'

const authRoutes = Router()

//Criando a primeira rota que é o 'register'
//Ao acessar a rota a vai ser chamado o '.store' que vai redirecionar para o store
authRoutes.post('/register', AuthController.store)
authRoutes.post('/login', AuthController.login)
authRoutes.post('/refresh', AuthController.refresh)
authRoutes.post('/logout', AuthController.logout)

export default authRoutes