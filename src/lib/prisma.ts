// Importa o adapter que conecta o Prisma ao driver pg
import { PrismaPg } from '@prisma/adapter-pg'

// Importa o PrismaClient gerado pelo "npx prisma generate"
import { PrismaClient } from '../generated/prisma/client'

// Cria o adapter passando direto a connection string do .env
// O PrismaPg gerencia o pool de conexões internamente
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

// Cria a instância do PrismaClient usando o adapter
const prisma = new PrismaClient({ adapter })

// Exporta para ser usado em qualquer lugar do projeto
export default prisma
