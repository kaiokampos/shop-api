import { Router } from 'express'
import * as ProductController from './products.controller'
import { authenticate, authorize } from '../../middleware/auth.middleware'

const router = Router()

// Rotas públicas — qualquer um pode ver produtos
router.get('/', ProductController.getAllProducts)
router.get('/:id', ProductController.getProductById)

// Rotas protegidas — apenas admins podem criar, atualizar e deletar
// O "authenticate" verifica o JWT
// O "authorize('admin')" verifica se o usuário é admin
router.post('/', authenticate, authorize('admin'), ProductController.createProduct)
router.put('/:id', authenticate, authorize('admin'), ProductController.updateProduct)
router.delete('/:id', authenticate, authorize('admin'), ProductController.deleteProduct)

export default router
