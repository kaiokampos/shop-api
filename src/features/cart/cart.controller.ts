import { Request, Response } from 'express'
import * as CartService from './cart.service'

// GET /cart — Retorna o carrinho do usuário autenticado
export const getCart = async (req: Request, res: Response) => {
  try {
    // req.user foi preenchido pelo middleware de autenticação
    const cart = await CartService.getCart(req.user!.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar carrinho' })
  }
}

// POST /cart/items — Adiciona um produto ao carrinho
export const addItem = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      res.status(400).json({ error: 'productId é obrigatório' })
      return
    }

    if (quantity < 1) {
      res.status(400).json({ error: 'Quantidade deve ser maior que zero' })
      return
    }

    const cart = await CartService.addItem(req.user!.id, productId, quantity)
    res.json(cart)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' })
  }
}

// DELETE /cart/items/:productId — Remove um produto do carrinho
export const removeItem = async (req: Request, res: Response) => {
  try {
    const cart = await CartService.removeItem(req.user!.id, String(req.params.productId))
    res.json(cart)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Erro ao remover item do carrinho' })
  }
}

// DELETE /cart — Limpa todos os itens do carrinho
export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await CartService.clearCart(req.user!.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao limpar carrinho' })
  }
}
