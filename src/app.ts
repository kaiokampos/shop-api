import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './lib/swagger'
import productsRouter from './features/products/products.routes'
import authRouter from './features/auth/auth.routes'
import cartRouter from './features/cart/cart.routes'
import ordersRouter from './features/orders/orders.routes'

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

// ── SWAGGER ──
// Serve a interface visual do Swagger em /docs
// contentSecurityPolicy: false necessário para o Swagger UI carregar corretamente
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'ShopAPI Docs',
    swaggerOptions: {
      persistAuthorization: true, // Mantém o token JWT entre as requisições
    },
  }),
)

// Endpoint que retorna o JSON do spec OpenAPI
// Útil para ferramentas externas consumirem a documentação
app.get('/docs.json', (req: Request, res: Response) => {
  res.json(swaggerSpec)
})

// ── ROTAS ──
app.use('/auth', authRouter)
app.use('/products', productsRouter)
app.use('/cart', cartRouter)
app.use('/orders', ordersRouter)

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Shop API está rodando!' })
})

export default app
