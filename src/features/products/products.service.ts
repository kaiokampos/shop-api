// Importa o cliente Prisma compartilhado
import prisma from '../../lib/prisma'

// ── TIPOS ──

// Define a estrutura dos dados para criar um produto
// O "?" significa que o campo é opcional
type CreateProductData = {
  name: string
  description?: string
  price: number
  stock?: number
}

// Define a estrutura dos dados para atualizar um produto
// O "Partial<>" torna TODOS os campos opcionais
// Assim podemos atualizar só o nome, só o preço, etc
type UpdateProductData = Partial<CreateProductData>

// ── FUNÇÕES DE SERVIÇO ──

// Busca todos os produtos no banco
// Ordenados do mais recente para o mais antigo
export const getAllProducts = async () => {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

// Busca um produto pelo ID
// Retorna null se não encontrar
export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  })
}

// Cria um novo produto no banco
export const createProduct = async (data: CreateProductData) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      // "price" precisa ser string para o Prisma aceitar como Decimal
      price: data.price.toString(),
      stock: data.stock ?? 0,
    },
  })
}

// Atualiza um produto existente
export const updateProduct = async (id: string, data: UpdateProductData) => {
  return prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price?.toString(),
      stock: data.stock,
    },
  })
}

// Remove um produto pelo ID
export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  })
}
