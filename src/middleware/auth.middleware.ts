import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extende o tipo Request do Express para incluir o usuário autenticado
// Assim podemos acessar "req.user" em qualquer controller protegido
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

// Tipo do payload que colocamos dentro do JWT
type JwtPayload = {
  id: string
  email: string
  role: string
}

// Middleware de autenticação
// "NextFunction" permite passar para o próximo middleware ou controller
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Pega o header Authorization da requisição
  // Formato esperado: "Bearer eyJhbGci..."
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  // Remove o "Bearer " e fica só com o token
  const token = authHeader.split(' ')[1]

  try {
    // Verifica e decodifica o token usando o JWT_SECRET
    // Se o token for inválido ou expirado, lança um erro
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

    // Anexa o usuário decodificado na requisição
    // Agora qualquer controller pode acessar req.user
    req.user = payload

    // Passa para o próximo middleware ou controller
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

// Middleware de autorização por role
// Retorna um middleware que só deixa passar usuários com o role correto
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Acesso negado' })
      return
    }
    next()
  }
}
