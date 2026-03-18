// Importa o Express e os tipos necessários
import express, { Application, Request, Response } from 'express'

// Importa o helmet — adiciona headers de segurança HTTP
import helmet from 'helmet'

// Importa o cors — permite requisições de outros domínios (ex: frontend)
import cors from 'cors'

// Cria a instância do Express
// "app" é o objeto central — nele registramos middlewares e rotas
const app: Application = express()

// ── MIDDLEWARES GLOBAIS ──
// Middlewares são funções que rodam em TODA requisição, antes de chegar nas rotas

// Ativa os headers de segurança HTTP automaticamente
app.use(helmet())

// Ativa o CORS — permite que frontends acessem a API
app.use(cors())

// Permite que o Express leia o body das requisições em formato JSON
// Sem isso, req.body seria undefined em requisições POST/PUT
app.use(express.json())

// ── ROTAS ──

// Rota de health check — usada para verificar se a API está no ar
// GET /health retorna um JSON simples confirmando que está rodando
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Shop API está rodando!',
  })
})

// Exporta o app para ser usado no server.ts e nos testes
export default app
