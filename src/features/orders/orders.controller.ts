import { Request, Response } from 'express'
import * as OrdersService from './orders.service'

// POST /orders — Finaliza a compra e cria um pedido
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrdersService.createOrder(req.user!.id)
    res.status(201).json(order)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Erro ao criar pedido' })
  }
}

// GET /orders — Lista todos os pedidos do usuário autenticado
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrdersService.getUserOrders(req.user!.id)
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' })
  }
}

// GET /orders/:id — Busca um pedido específico
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrdersService.getOrderById(String(req.params.id), req.user!.id)
    res.json(order)
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Erro ao buscar pedido' })
  }
}

// PATCH /orders/:id/status — Atualiza o status do pedido (admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        error: `Status inválido. Use: ${validStatuses.join(', ')}`,
      })
      return
    }

    const order = await OrdersService.updateOrderStatus(String(req.params.id), status)
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' })
  }
}
