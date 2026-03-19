# 🛒 ShopAPI

API REST de e-commerce construída com Node.js, Express 5 e TypeScript.

## 🚀 Tecnologias

- **Node.js 24** — Runtime JavaScript
- **TypeScript 5.9** — Tipagem estática
- **Express 5** — Framework HTTP
- **PostgreSQL** — Banco de dados relacional
- **Prisma 7** — ORM moderno
- **JWT** — Autenticação stateless
- **Jest + Supertest** — Testes automatizados
- **ESLint + Prettier** — Qualidade de código

## 📦 Funcionalidades

- ✅ Cadastro e autenticação de usuários com JWT
- ✅ Autorização por roles (admin/customer)
- ✅ CRUD completo de produtos
- ✅ Carrinho de compras
- ✅ Finalização de pedidos com transação atômica
- ✅ Controle de estoque automático
- ✅ Testes automatizados

## 🗂️ Estrutura do projeto

```
src/
├── features/
│   ├── auth/          # Autenticação (register, login)
│   ├── products/      # CRUD de produtos
│   ├── cart/          # Carrinho de compras
│   └── orders/        # Pedidos
├── middleware/        # Autenticação JWT e autorização
├── lib/               # Cliente Prisma compartilhado
├── app.ts             # Configuração do Express
└── server.ts          # Ponto de entrada
```

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 22+
- PostgreSQL

### Instalação

```bash
# Clone o repositório
git clone https://github.com/kaiokampos/shop-api.git
cd shop-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### Banco de dados

```bash
# Crie o banco de dados
psql -U postgres -c "CREATE DATABASE shop_api;"

# Execute as migrations
npx prisma migrate dev

# Gere o Prisma Client
npx prisma generate
```

### Rodando

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### Testes

```bash
npm test
```

## 🔒 Autenticação

A API usa JWT. Para acessar rotas protegidas, inclua o header:

```
Authorization: Bearer <token>
```

## 📡 Endpoints

### Auth

| Método | Rota             | Descrição           | Auth |
| ------ | ---------------- | ------------------- | ---- |
| POST   | `/auth/register` | Cadastro de usuário | ❌   |
| POST   | `/auth/login`    | Login               | ❌   |

### Products

| Método | Rota            | Descrição        | Auth  |
| ------ | --------------- | ---------------- | ----- |
| GET    | `/products`     | Lista produtos   | ❌    |
| GET    | `/products/:id` | Busca produto    | ❌    |
| POST   | `/products`     | Cria produto     | Admin |
| PUT    | `/products/:id` | Atualiza produto | Admin |
| DELETE | `/products/:id` | Remove produto   | Admin |

### Cart

| Método | Rota              | Descrição       | Auth |
| ------ | ----------------- | --------------- | ---- |
| GET    | `/cart`           | Ver carrinho    | ✅   |
| POST   | `/cart/items`     | Adicionar item  | ✅   |
| DELETE | `/cart/items/:id` | Remover item    | ✅   |
| DELETE | `/cart`           | Limpar carrinho | ✅   |

### Orders

| Método | Rota                 | Descrição        | Auth  |
| ------ | -------------------- | ---------------- | ----- |
| POST   | `/orders`            | Finalizar compra | ✅    |
| GET    | `/orders`            | Listar pedidos   | ✅    |
| GET    | `/orders/:id`        | Buscar pedido    | ✅    |
| PATCH  | `/orders/:id/status` | Atualizar status | Admin |

## 📄 Licença

MIT
