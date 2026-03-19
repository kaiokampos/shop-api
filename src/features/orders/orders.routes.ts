import { Router } from 'express'
import * as OrdersController from './orders.controller'
import { authenticate, authorize } from '../../middleware/auth.middleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Pedidos e checkout
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Finaliza a compra e cria um pedido
 *     description: Converte o carrinho em pedido, decrementa o estoque e limpa o carrinho — tudo em uma transação atômica
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Carrinho vazio ou estoque insuficiente
 *       401:
 *         description: Token não fornecido
 */
router.post('/', authenticate, OrdersController.createOrder)

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos do usuário autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos com itens
 *       401:
 *         description: Token não fornecido
 */
router.get('/', authenticate, OrdersController.getUserOrders)

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: Token não fornecido
 */
router.get('/:id', authenticate, OrdersController.getOrderById)

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *                 example: paid
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Acesso negado — requer role admin
 */
router.patch('/:id/status', authenticate, authorize('admin'), OrdersController.updateOrderStatus)

export default router
