import { Router } from 'express'
import * as OrdersController from './orders.controller'
import { authenticate, authorize } from '../../middleware/auth.middleware'

const router = Router()

// POST /orders — Finaliza compra — qualquer usuário autenticado
router.post('/', authenticate, OrdersController.createOrder)

// GET /orders — Lista pedidos do usuário autenticado
router.get('/', authenticate, OrdersController.getUserOrders)

// GET /orders/:id — Busca pedido específico
router.get('/:id', authenticate, OrdersController.getOrderById)

// PATCH /orders/:id/status — Atualiza status — apenas admins
router.patch('/:id/status', authenticate, authorize('admin'), OrdersController.updateOrderStatus)

export default router
