import { Router } from 'express'
import * as CartController from './cart.controller'
import { authenticate } from '../../middleware/auth.middleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Carrinho de compras
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retorna o carrinho do usuário autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho com itens e produtos
 *       401:
 *         description: Token não fornecido
 */
router.get('/', authenticate, CartController.getCart)

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Adiciona um produto ao carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "5350afe0-2ea0-410a-bfdd-74a7cfb42c28"
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Carrinho atualizado
 *       400:
 *         description: Produto não encontrado ou estoque insuficiente
 *       401:
 *         description: Token não fornecido
 */
router.post('/items', authenticate, CartController.addItem)

/**
 * @swagger
 * /cart/items/{productId}:
 *   delete:
 *     summary: Remove um produto do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a remover
 *     responses:
 *       200:
 *         description: Carrinho atualizado
 *       400:
 *         description: Item não encontrado no carrinho
 *       401:
 *         description: Token não fornecido
 */
router.delete('/items/:productId', authenticate, CartController.removeItem)

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Limpa todos os itens do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho limpo
 *       401:
 *         description: Token não fornecido
 */
router.delete('/', authenticate, CartController.clearCart)

export default router
