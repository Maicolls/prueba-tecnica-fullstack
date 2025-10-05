import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Obtener todos los usuarios
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      })

      return res.status(200).json({ users })
    }

    if (req.method === 'PUT') {
      // Actualizar un usuario
      const { id, name, role } = req.body

      // Validar datos requeridos
      if (!id || !name || !role) {
        return res.status(400).json({ 
          error: 'ID, nombre y rol son requeridos' 
        })
      }

      // Validar que el rol sea válido
      if (!['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ 
          error: 'Rol inválido. Debe ser USER o ADMIN' 
        })
      }

      // Actualizar el usuario
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { 
          name,
          role 
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        }
      })

      return res.status(200).json({ user: updatedUser })
    }

    // Método no permitido
    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).json({ error: 'Método no permitido' })

  } catch (error) {
    console.error('Error en API de usuarios:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor' 
    })
  } finally {
    await prisma.$disconnect()
  }
}