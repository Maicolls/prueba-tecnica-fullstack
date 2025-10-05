import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === 'GET') {
            // get all movements
            const movements = await prisma.movement.findMany({
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    date: 'desc'
                }
            })

            return res.status(200).json({ movements })
        }
        if (req.method === 'POST') {
            // Create a new movement
            const { concept, amount, date, type, userId } = req.body

            // Validate required fields
            if (!concept || !amount || !date || !type || !userId) {
                return res.status(400).json({
                    error: 'Concepto, monto, fecha, tipo y usuario son requeridos'
                })
            }

            // Validate role
            if (!['INCOME', 'EXPENSE'].includes(type)) {
                return res.status(400).json({
                    error: 'Tipo inválido. Debe ser INCOME o EXPENSE'
                })
            }

            // Update user  (only name and role)        
            const newMovement = await prisma.movement.create({
                data: {
                    concept,
                    amount: parseFloat(amount),
                    date: new Date(date),
                    type,
                    userId
                },
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            return res.status(201).json({ movement: newMovement })
        }

        // Método no permitido
      res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Método no permitido' })

    } catch (error) {
        console.error('Error en API de movements:', error)
        return res.status(500).json({
            error: 'Error interno del servidor'
        })
    } finally {
        await prisma.$disconnect()
    }
}