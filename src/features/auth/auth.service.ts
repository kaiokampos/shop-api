import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'

// ── TIPOS ──

type RegisterData = {
  name: string
  email: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

// ── FUNÇÕES ──

// Cadastra um novo usuário
export const register = async (data: RegisterData) => {
  // Verifica se o email já está em uso
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    // Lança um erro que o controller vai capturar
    throw new Error('Email já cadastrado')
  }

  // Gera o hash da senha — o número 10 é o "salt rounds"
  // Quanto maior, mais seguro e mais lento — 10 é o padrão recomendado
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Cria o usuário no banco com a senha hasheada
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  })

  // Nunca retornamos a senha — nem o hash
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Autentica um usuário e retorna um token JWT
export const login = async (data: LoginData) => {
  // Busca o usuário pelo email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  // Mensagem genérica — não revelamos se o email existe ou não
  // Isso evita ataques de enumeração de usuários
  if (!user) {
    throw new Error('Credenciais inválidas')
  }

  // Compara a senha enviada com o hash salvo no banco
  const passwordMatch = await bcrypt.compare(data.password, user.password)

  if (!passwordMatch) {
    throw new Error('Credenciais inválidas')
  }

  // Gera o token JWT
  // O payload contém informações do usuário — ficam dentro do token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    // Chave secreta do .env
    process.env.JWT_SECRET as string,
    {
      // Token expira em 7 dias
      expiresIn: '7d',
    },
  )

  const { password: _, ...userWithoutPassword } = user

  return {
    user: userWithoutPassword,
    token,
  }
}
