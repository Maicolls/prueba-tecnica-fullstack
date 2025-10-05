import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@/lib/auth/client'

export default function DocsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  if (isPending) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Cargando...</div>
    </div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/40 backdrop-blur-xl border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent mb-2">
                Documentación de API
              </h1>
              <p className="text-gray-400">Sistema de Gestión de Ingresos y Egresos</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Documentación Custom */}
        <div className="space-y-6">
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">📋 Información General</h2>
              <div className="text-gray-300 space-y-2">
                <p><span className="text-green-400 font-medium">Base URL:</span> https://prueba-tecnica-fullstack-ny9a.vercel.app</p>
                <p><span className="text-green-400 font-medium">Versión:</span> 1.0.0</p>
                <p><span className="text-green-400 font-medium">Autenticación:</span> Sesión por cookies (Better Auth)</p>
              </div>
            </div>

            {/* Endpoints de Movimientos */}
            <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">💰 Endpoints de Movimientos</h2>
              
              {/* GET /api/movements */}
              <div className="mb-8 border border-gray-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-mono text-sm">GET</span>
                  <code className="text-green-400 font-mono">/api/movements</code>
                </div>
                <p className="text-gray-300 mb-4">Obtiene todos los movimientos del usuario autenticado</p>
                
                <h4 className="text-white font-medium mb-2">📤 Respuesta exitosa (200):</h4>
                <pre className="bg-gray-900/50 p-4 rounded-lg text-sm text-green-400 overflow-x-auto">
{`{
  "movements": [
    {
      "id": "cm2wkds0x000012345678901",
      "concept": "Venta de productos",
      "amount": 150000,
      "date": "2025-10-04T00:00:00.000Z",
      "type": "INCOME",
      "userId": "user_12345"
    }
  ]
}`}
                </pre>
              </div>

              {/* POST /api/movements */}
              <div className="mb-8 border border-gray-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-mono text-sm">POST</span>
                  <code className="text-green-400 font-mono">/api/movements</code>
                </div>
                <p className="text-gray-300 mb-4">Crea un nuevo movimiento</p>
                
                <h4 className="text-white font-medium mb-2">📥 Cuerpo de la petición:</h4>
                <pre className="bg-gray-900/50 p-4 rounded-lg text-sm text-green-400 overflow-x-auto mb-4">
{`{
  "concept": "Venta de productos",
  "amount": 150000,
  "date": "2025-10-04",
  "type": "INCOME"
}`}
                </pre>

                <h4 className="text-white font-medium mb-2">📤 Respuesta exitosa (201):</h4>
                <pre className="bg-gray-900/50 p-4 rounded-lg text-sm text-green-400 overflow-x-auto">
{`{
  "message": "Movimiento creado exitosamente",
  "movement": {
    "id": "cm2wkds0x000012345678901",
    "concept": "Venta de productos",
    "amount": 150000,
    "date": "2025-10-04T00:00:00.000Z",
    "type": "INCOME",
    "userId": "user_12345"
  }
}`}
                </pre>
              </div>
            </div>

            {/* Endpoints de Usuarios */}
            <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">👥 Endpoints de Usuarios</h2>
              
              {/* GET /api/users */}
              <div className="mb-8 border border-gray-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-mono text-sm">GET</span>
                  <code className="text-green-400 font-mono">/api/users</code>
                </div>
                <p className="text-gray-300 mb-4">Obtiene todos los usuarios (requiere rol ADMIN)</p>
                
                <h4 className="text-white font-medium mb-2">📤 Respuesta exitosa (200):</h4>
                <pre className="bg-gray-900/50 p-4 rounded-lg text-sm text-green-400 overflow-x-auto">
{`{
  "users": [
    {
      "id": "user_12345",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "role": "ADMIN"
    }
  ]
}`}
                </pre>
              </div>

              {/* POST /api/users */}
              <div className="mb-8 border border-gray-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-mono text-sm">POST</span>
                  <code className="text-green-400 font-mono">/api/users</code>
                </div>
                <p className="text-gray-300 mb-4">Crea o actualiza un usuario</p>
                
                <h4 className="text-white font-medium mb-2">📥 Cuerpo de la petición:</h4>
                <pre className="bg-gray-900/50 p-4 rounded-lg text-sm text-green-400 overflow-x-auto">
{`{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone": "555-0123",
  "role": "USER"
}`}
                </pre>
              </div>
            </div>

            {/* Endpoints de Reportes */}
            <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">📊 Endpoints de Reportes</h2>
              
              {/* GET /api/reports/stats */}
              <div className="mb-8 border border-gray-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-mono text-sm">GET</span>
                  <code className="text-green-400 font-mono">/api/reports/stats</code>
                </div>
                <p className="text-gray-300 mb-4">Obtiene estadísticas financieras del usuario</p>
                
                <h4 className="text-white font-medium mb-2">📤 Respuesta exitosa (200):</h4>
                <pre className="bg-gray-900/50 p-4 rounded-lg text-sm text-green-400 overflow-x-auto">
{`{
  "totalIngresos": 500000,
  "totalEgresos": 300000,
  "saldo": 200000,
  "totalMovimientos": 15,
  "ingresosPorMes": [
    { "mes": "2024-10", "total": 250000 }
  ],
  "egresosPorMes": [
    { "mes": "2024-10", "total": 150000 }
  ]
}`}
                </pre>
              </div>
            </div>

            {/* Códigos de Error */}
            <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">❌ Códigos de Error</h2>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-red-400 font-mono">400</span>
                    <span className="text-gray-300">Bad Request - Datos inválidos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-400 font-mono">401</span>
                    <span className="text-gray-300">Unauthorized - No autenticado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-400 font-mono">403</span>
                    <span className="text-gray-300">Forbidden - Sin permisos</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-red-400 font-mono">404</span>
                    <span className="text-gray-300">Not Found - Recurso no encontrado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-400 font-mono">405</span>
                    <span className="text-gray-300">Method Not Allowed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-400 font-mono">500</span>
                    <span className="text-gray-300">Internal Server Error</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
