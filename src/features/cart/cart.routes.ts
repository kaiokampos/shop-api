import { Router } from 'express'
import * as CartController from './cart.controller'
import { authenticate } from '../../middleware/auth.middleware'

const router = Router()

// Todas as rotas do carrinho exigem autenticação
// O usuário precisa estar logado para acessar seu carrinho

// GET /cart — Retorna o carrinho
router.get('/', authenticate, CartController.getCart)

// POST /cart/items — Adiciona item ao carrinho
router.post('/items', authenticate, CartController.addItem)

// DELETE /cart/items/:productId — Remove item do carrinho
router.delete('/items/:productId', authenticate, CartController.removeItem)

// DELETE /cart — Limpa o carrinho
router.delete('/', authenticate, CartController.clearCart)

export default router
