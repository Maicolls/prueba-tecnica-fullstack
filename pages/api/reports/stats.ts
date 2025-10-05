import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // get movement stats
      
      // 1. Total income
      const incomeTotal = await prisma.movement.aggregate({
        where: { type: 'INCOME' },
        _sum: { amount: true }
      })

      // 2. Total expenses
      const expenseTotal = await prisma.movement.aggregate({
        where: { type: 'EXPENSE' },
        _sum: { amount: true }
      })

      // 3. calculate balance
      const totalIngresos = Number(incomeTotal._sum.amount) || 0
      const totalEgresos = Number(expenseTotal._sum.amount) || 0
      const saldo = totalIngresos - totalEgresos

      // 4. Movements per month (last 12 months)
      const movimientosPorMes = await prisma.movement.findMany({
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), 0, 1) // Before January of the current year 
          }
        },
        select: {
          amount: true,
          type: true,
          date: true
        }
      })

      // group by month
      const mesesData: Record<string, { mes: string, ingresos: number, egresos: number }> = {}
      movimientosPorMes.forEach(movement => {
        const mes = new Date(movement.date).toLocaleDateString('es-ES', { 
          month: 'long' 
        })
        
        if (!mesesData[mes]) {
          mesesData[mes] = { mes, ingresos: 0, egresos: 0 }
        }
        
        if (movement.type === 'INCOME') {
          mesesData[mes].ingresos += Number(movement.amount)
        } else {
          mesesData[mes].egresos += Number(movement.amount)
        }
      })

      const movimientosPorMesArray = Object.values(mesesData)

      return res.status(200).json({
        totalIngresos,
        totalEgresos,
        saldo,
        movimientosPorMes: movimientosPorMesArray
      })
    }

    //Don't forget this Rechazar métodos HTTP no soportados (solo permitimos GET para obtener estadísticas)
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Método no permitido. Solo se permite GET para obtener estadísticas.' })

  } catch (error) {
    console.error('Error en API de reportes:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor' 
    })
  } finally {
    await prisma.$disconnect()
  }
}