// Carrega as variáveis do arquivo .env para process.env
// Deve ser a PRIMEIRA linha — antes de qualquer outro import
import 'dotenv/config'

// Importa o app configurado
import app from './app'

// Lê a porta do .env — se não existir, usa 3000 como padrão
// O "Number()" converte a string do .env para número
const PORT = Number(process.env.PORT) || 3000

// Liga o servidor na porta definida
// O callback roda uma vez quando o servidor estiver pronto
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📋 Ambiente: ${process.env.NODE_ENV}`)
})
