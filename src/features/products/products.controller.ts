// Importa os tipos do Express para ter autocomplete e segurança de tipos
import { Request, Response } from 'express'

// Importa todas as funções do service
import * as ProductService from './products.service'

// GET /products — Lista todos os produtos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getAllProducts()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
}

// GET /products/:id — Busca um produto pelo ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    // "req.params.id" pega o ":id" da URL
    const product = await ProductService.getProductById(String(req.params.id))

    // Se não encontrar, retorna 404
    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' })
      return
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' })
  }
}

// POST /products — Cria um novo produto
export const createProduct = async (req: Request, res: Response) => {
  try {
    // "req.body" contém os dados enviados no corpo da requisição
    const { name, description, price, stock } = req.body

    // Validação básica — campos obrigatórios
    if (!name || !price) {
      res.status(400).json({ error: 'Nome e preço são obrigatórios' })
      return
    }

    const product = await ProductService.createProduct({
      name,
      description,
      price,
      stock,
    })

    // 201 = Created — indica que um recurso foi criado com sucesso
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
}

// PUT /products/:id — Atualiza um produto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock } = req.body

    const product = await ProductService.updateProduct(String(req.params.id), {
      name,
      description,
      price,
      stock,
    })

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
}

// DELETE /products/:id — Remove um produto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await ProductService.deleteProduct(String(req.params.id))

    // 204 = No Content — sucesso sem corpo de resposta
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' })
  }
}
