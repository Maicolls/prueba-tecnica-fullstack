import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Sistema de Gestión de Ingresos y Egresos API',
    version: '1.0.0',
    description: 'API para gestionar movimientos financieros, usuarios y generar reportes',
    contact: {
      name: 'Desarrollador',
      email: 'dev@ejemplo.com'
    }
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }
  ],
  components: {
    schemas: {
      Movement: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm123456' },
          concept: { type: 'string', example: 'Venta de productos' },
          amount: { type: 'number', example: 150000 },
          date: { type: 'string', format: 'date', example: '2025-10-04' },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
          userId: { type: 'string', example: 'user123' }
        },
        required: ['concept', 'amount', 'date', 'type', 'userId']
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user123' },
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan@example.com' },
          phone: { type: 'string', example: '555-0123' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'ADMIN' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Mensaje de error' },
          message: { type: 'string', example: 'Descripción detallada del error' }
        }
      }
    }
  },
  paths: {
    '/api/movements': {
      get: {
        summary: 'Obtener todos los movimientos',
        tags: ['Movimientos'],
        responses: {
          '200': {
            description: 'Lista de movimientos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Movement' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Crear un nuevo movimiento',
        tags: ['Movimientos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Movement' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Movimiento creado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Movement' }
              }
            }
          }
        }
      }
    },
    '/api/users': {
      get: {
        summary: 'Obtener todos los usuarios',
        tags: ['Usuarios'],
        responses: {
          '200': {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        }
      }
    },
    '/api/reports': {
      get: {
        summary: 'Obtener reporte financiero',
        tags: ['Reportes'],
        responses: {
          '200': {
            description: 'Datos del reporte',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalIngresos: { type: 'number' },
                    totalEgresos: { type: 'number' },
                    saldo: { type: 'number' },
                    movimientosPorMes: { type: 'array' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const options = {
  definition: swaggerDefinition,
  apis: [], // No necesitamos esto por ahora
}

export const swaggerSpec = swaggerJSDoc(options)