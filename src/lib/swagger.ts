import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopAPI',
      version: '1.0.0',
      description:
        'API REST de e-commerce construída com Node.js, TypeScript, Express 5 e Prisma 7.',
      contact: {
        name: 'Kaio Campos',
        url: 'https://github.com/kaiokampos/shop-api',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Desenvolvimento',
      },
      {
        url: 'https://shop-api-production-5461.up.railway.app',
        description: 'Produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint /auth/login',
        },
      },
      // Schemas reutilizáveis — referenciados com $ref nas rotas
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '5350afe0-2ea0-410a-bfdd-74a7cfb42c28' },
            name: { type: 'string', example: 'Tênis Nike Air' },
            description: { type: 'string', example: 'Tênis esportivo confortável' },
            price: { type: 'string', example: '299.9' },
            stock: { type: 'integer', example: 50 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '5da97cc5-7028-4b4a-be94-69943e435471' },
            name: { type: 'string', example: 'Kaio Campos' },
            email: { type: 'string', example: 'kaio@example.com' },
            role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
              example: 'pending',
            },
            total: { type: 'string', example: '599.8' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  productId: { type: 'string' },
                  quantity: { type: 'integer' },
                  price: { type: 'string' },
                  product: { $ref: '#/components/schemas/Product' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' },
          },
        },
      },
    },
  },
  apis: ['./src/features/**/*.routes.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
