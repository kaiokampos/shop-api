import request from 'supertest'
import app from '../../app'
import prisma from '../../lib/prisma'

// "describe" agrupa testes relacionados
describe('Auth endpoints', () => {
  // Antes de todos os testes, limpa os usuários de teste do banco
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: '@test-jest.com' } },
    })
  })

  // Depois de todos os testes, limpa novamente e fecha a conexão
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: '@test-jest.com' } },
    })
    await prisma.$disconnect()
  })

  // ── REGISTER ──
  describe('POST /auth/register', () => {
    it('deve cadastrar um novo usuário com sucesso', async () => {
      // "request(app)" faz uma requisição HTTP real no app
      const response = await request(app).post('/auth/register').send({
        name: 'Test User',
        email: 'user@test-jest.com',
        password: '123456',
      })

      // "expect" verifica o resultado
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.email).toBe('user@test-jest.com')
      // Garante que a senha não está na resposta
      expect(response.body).not.toHaveProperty('password')
    })

    it('deve retornar erro com email duplicado', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'Test User',
        email: 'user@test-jest.com',
        password: '123456',
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
    })

    it('deve retornar erro quando campos obrigatórios faltam', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'outro@test-jest.com',
        // sem name e password
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
    })
  })

  // ── LOGIN ──
  describe('POST /auth/login', () => {
    it('deve fazer login com sucesso e retornar token', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@test-jest.com',
        password: '123456',
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user).not.toHaveProperty('password')
    })

    it('deve retornar erro com senha errada', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'user@test-jest.com',
        password: 'senhaerrada',
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
    })

    it('deve retornar erro com email inexistente', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'naoexiste@test-jest.com',
        password: '123456',
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
    })
  })
})
