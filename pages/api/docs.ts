import { NextApiRequest, NextApiResponse } from 'next'
import { swaggerSpec } from '@/lib/swagger'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(swaggerSpec)
  } else {
    res.status(405).json({ message: 'Método no permitido' })
  }
}
/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Obtiene la documentación de la API en formato JSON
 *     tags: [Documentación]
 *     responses:
 *       200:
 *         description: Especificación OpenAPI en formato JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */