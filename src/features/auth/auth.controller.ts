import { Request, Response } from 'express'
import * as AuthService from './auth.service'

// POST /auth/register — Cadastra um novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // Validação básica
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
      return
    }

    // Validação mínima de senha
    if (password.length < 6) {
      res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' })
      return
    }

    const user = await AuthService.register({ name, email, password })

    // 201 = Created
    res.status(201).json(user)
  } catch (error) {
    // Se o service lançou um erro conhecido, retornamos a mensagem
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Erro ao cadastrar usuário' })
  }
}

// POST /auth/login — Autentica um usuário
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validação básica
    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' })
      return
    }

    const result = await AuthService.login({ email, password })

    res.json(result)
  } catch (error) {
    if (error instanceof Error) {
      // 401 = Unauthorized — credenciais inválidas
      res.status(401).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}
