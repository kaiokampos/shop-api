// Importa o Router do Express
// Router é um mini-app que agrupa rotas relacionadas
import { Router } from 'express'

// Importa todos os controllers de produtos
import * as ProductController from './products.controller'

// Cria o router de produtos
const router = Router()

// Define as rotas e conecta aos controllers
// O Express vai chamar o controller correto dependendo do método e caminho

// GET /products
router.get('/', ProductController.getAllProducts)

// GET /products/:id
router.get('/:id', ProductController.getProductById)

// POST /products
router.post('/', ProductController.createProduct)

// PUT /products/:id
router.put('/:id', ProductController.updateProduct)

// DELETE /products/:id
router.delete('/:id', ProductController.deleteProduct)

// Exporta o router para ser registrado no app.ts
export default router
