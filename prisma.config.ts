// Carrega as variáveis do .env
import 'dotenv/config'

// "defineConfig" garante tipagem e autocomplete na configuração
// "env" lê variáveis de ambiente com segurança de tipo
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // Localização do schema principal
  schema: 'prisma/schema.prisma',

  // Configuração das migrations
  migrations: {
    path: 'prisma/migrations',
  },

  // Conexão com o banco — lê do .env
  datasource: {
    url: env('DATABASE_URL'),
  },
})
