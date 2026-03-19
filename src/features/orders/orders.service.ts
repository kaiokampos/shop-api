import prisma from '../../lib/prisma'

// Finaliza a compra — converte o carrinho em pedido
export const createOrder = async (userId: string) => {
  // Busca o carrinho com todos os itens e produtos
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  // Valida se o carrinho existe e tem itens
  if (!cart || cart.items.length === 0) {
    throw new Error('Carrinho vazio ou não encontrado')
  }

  // Verifica estoque de todos os produtos antes de criar o pedido
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new Error(
        `Estoque insuficiente para "${item.product.name}". Disponível: ${item.product.stock}`,
      )
    }
  }

  // Calcula o total do pedido
  const total = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity
  }, 0)

  // TRANSAÇÃO — tudo isso acontece de forma atômica
  // Se qualquer etapa falhar, TUDO é desfeito automaticamente
  const order = await prisma.$transaction(async (tx) => {
    // 1. Cria o pedido
    const newOrder = await tx.order.create({
      data: {
        userId,
        total: total.toString(),
        // Cria os itens do pedido ao mesmo tempo
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            // Salva o preço atual — histórico imutável
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    // 2. Decrementa o estoque de cada produto
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      })
    }

    // 3. Limpa o carrinho
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return newOrder
  })

  return order
}

// Lista todos os pedidos do usuário
export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Busca um pedido pelo ID
export const getOrderById = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  // Garante que o usuário só vê seus próprios pedidos
  if (!order || order.userId !== userId) {
    throw new Error('Pedido não encontrado')
  }

  return order
}

// Atualiza o status do pedido — apenas admins
export const updateOrderStatus = async (id: string, status: string) => {
  return prisma.order.update({
    where: { id },
    data: { status: status as any },
  })
}
