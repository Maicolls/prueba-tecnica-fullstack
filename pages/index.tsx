import { useSession, authClient } from '@/lib/auth/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/login')
  }

  if (isPending) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Cargando...</div>
    </div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Sistema de Gestión</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hola, {session.user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Menú Principal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Movimientos</h3>
              <p className="text-gray-600 mb-4">Gestionar ingresos y egresos</p>
              <button
                onClick={() => router.push('/movimientos')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ir a Movimientos
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Usuarios</h3>
              <p className="text-gray-600 mb-4">Administrar usuarios del sistema</p>
              <button
                onClick={() => router.push('/usuarios')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Gestionar Usuarios
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Reportes</h3>
              <p className="text-gray-600 mb-4">Ver reportes y estadísticas</p>
              <button 
                onClick={() => router.push('/reportes')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Ver Reportes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}