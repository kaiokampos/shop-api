import { Router } from 'express'
import * as AuthController from './auth.controller'

const router = Router()

// POST /auth/register — Cadastro de novo usuário
router.post('/register', AuthController.register)

// POST /auth/login — Login
router.post('/login', AuthController.login)

export default router
