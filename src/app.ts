import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import productsRouter from './features/products/products.routes'
import authRouter from './features/auth/auth.routes'
import cartRouter from './features/cart/cart.routes'

// Importa o router de autenticação

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

// ── ROTAS ──

// Rotas de autenticação — /auth/register, /auth/login
app.use('/auth', authRouter)

// Rotas de produtos — /products/*
app.use('/products', productsRouter)
// Rotas do carrinho — /cart/*
app.use('/cart', cartRouter)

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Shop API está rodando!',
  })
})

export default app
