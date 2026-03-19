import request from 'supertest'
import app from '../../app'
import prisma from '../../lib/prisma'

describe('Products endpoints', () => {
  // Token de admin — gerado no login para usar nos testes protegidos
  let adminToken: string

  // ID do produto criado nos testes — reutilizado entre os testes
  let productId: string

  beforeAll(async () => {
    // Limpa produtos de teste anteriores
    await prisma.product.deleteMany({
      where: { name: { contains: '[TEST]' } },
    })

    // Limpa usuário de teste anterior
    await prisma.user.deleteMany({
      where: { email: 'admin@test-jest.com' },
    })

    // Cria um usuário admin para os testes
    await prisma.user.create({
      data: {
        name: 'Admin Test',
        email: 'admin@test-jest.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
        role: 'admin',
      },
    })

    // Faz login para pegar o token
    const response = await request(app).post('/auth/login').send({
      email: 'admin@test-jest.com',
      password: 'password',
    })

    adminToken = response.body.token
  })

  afterAll(async () => {
    await prisma.product.deleteMany({
      where: { name: { contains: '[TEST]' } },
    })
    await prisma.user.deleteMany({
      where: { email: 'admin@test-jest.com' },
    })
    await prisma.$disconnect()
  })

  // ── CRIAR PRODUTO ──
  describe('POST /products', () => {
    it('deve criar produto com token de admin', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '[TEST] Camiseta',
          price: 49.9,
          stock: 10,
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe('[TEST] Camiseta')

      // Salva o ID para usar nos próximos testes
      productId = response.body.id
    })

    it('deve retornar 401 sem token', async () => {
      const response = await request(app).post('/products').send({
        name: '[TEST] Produto Sem Token',
        price: 29.9,
      })

      expect(response.status).toBe(401)
    })

    it('deve retornar 400 sem campos obrigatórios', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // sem name e price
          stock: 5,
        })

      expect(response.status).toBe(400)
    })
  })

  // ── LISTAR PRODUTOS ──
  describe('GET /products', () => {
    it('deve listar produtos sem autenticação', async () => {
      const response = await request(app).get('/products')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  // ── BUSCAR PRODUTO ──
  describe('GET /products/:id', () => {
    it('deve buscar produto por ID', async () => {
      const response = await request(app).get(`/products/${productId}`)

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(productId)
    })

    it('deve retornar 404 para produto inexistente', async () => {
      const response = await request(app).get('/products/id-que-nao-existe')

      expect(response.status).toBe(404)
    })
  })

  // ── ATUALIZAR PRODUTO ──
  describe('PUT /products/:id', () => {
    it('deve atualizar produto com token de admin', async () => {
      const response = await request(app)
        .put(`/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 39.9 })

      expect(response.status).toBe(200)
      expect(response.body.price).toBe('39.9')
    })
  })

  // ── DELETAR PRODUTO ──
  describe('DELETE /products/:id', () => {
    it('deve deletar produto com token de admin', async () => {
      const response = await request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)
    })
  })
})
