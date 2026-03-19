import prisma from '../../lib/prisma'

// Busca ou cria o carrinho do usuário
// Se o usuário não tem carrinho, cria um automaticamente
const getOrCreateCart = async (userId: string) => {
  // "upsert" = update + insert
  // Se encontrar o carrinho, retorna ele
  // Se não encontrar, cria um novo
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      // Inclui os itens do carrinho com os dados do produto
      items: {
        include: { product: true },
      },
    },
  })
}

// Retorna o carrinho completo do usuário
export const getCart = async (userId: string) => {
  return getOrCreateCart(userId)
}

// Adiciona um produto ao carrinho
export const addItem = async (userId: string, productId: string, quantity: number) => {
  // Verifica se o produto existe
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  // Verifica se há estoque suficiente
  if (product.stock < quantity) {
    throw new Error(`Estoque insuficiente. Disponível: ${product.stock}`)
  }

  // Garante que o carrinho existe
  const cart = await getOrCreateCart(userId)

  // Verifica se o produto já está no carrinho
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  })

  if (existingItem) {
    // Se já existe, incrementa a quantidade
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    })
  } else {
    // Se não existe, cria um novo item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    })
  }

  // Retorna o carrinho atualizado
  return getOrCreateCart(userId)
}

// Remove um item do carrinho
export const removeItem = async (userId: string, productId: string) => {
  const cart = await getOrCreateCart(userId)

  // Verifica se o item existe no carrinho
  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  })

  if (!item) {
    throw new Error('Item não encontrado no carrinho')
  }

  await prisma.cartItem.delete({
    where: { id: item.id },
  })

  return getOrCreateCart(userId)
}

// Limpa todos os itens do carrinho
export const clearCart = async (userId: string) => {
  const cart = await getOrCreateCart(userId)

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  })

  return getOrCreateCart(userId)
}
