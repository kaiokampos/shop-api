import { Router } from 'express'
import * as AuthController from './auth.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Cadastro e autenticação de usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kaio Campos
 *               email:
 *                 type: string
 *                 format: email
 *                 example: kaio@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "5da97cc5-7028-4b4a-be94-69943e435471"
 *                 name:
 *                   type: string
 *                   example: Kaio Campos
 *                 email:
 *                   type: string
 *                   example: kaio@example.com
 *                 role:
 *                   type: string
 *                   example: customer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 */
router.post('/register', AuthController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: kaio@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para usar nas rotas protegidas
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', AuthController.login)

export default router
