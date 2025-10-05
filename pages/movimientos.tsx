import { useState, useEffect } from 'react'
import { useSession, authClient } from '@/lib/auth/client'
import { useRouter } from 'next/router'

// Type of movements
interface Movement {
  id: string
  concept: string
  amount: number
  date: string
  type: 'INCOME' | 'EXPENSE'
  userId: string
  user: {
    name: string
  }
}

export default function MovimientosPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
    const [movements, setMovements] = useState<Movement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Función para cargar movimientos desde la API
  const fetchMovements = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🚀 Cargando movimientos...')
      const response = await fetch('/api/movements')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Movimientos cargados:', data)
      
      setMovements(data.movements || [])
    } catch (err) {
      console.error(' Error cargando movimientos:', err)
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // Function to create a new movement
  const createMovement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (!session?.user?.id) {
      setError('Usuario no autenticado')
      return
    }

    try {
      const response = await fetch('/api/movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concept: formData.get('concept'),
          amount: formData.get('amount'),
          date: formData.get('date'),
          type: formData.get('type'),
          userId: session.user.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear movimiento')
      }

      // ✅ Si todo sale bien, cerrar modal y recargar
      setShowForm(false)
      await fetchMovements()
      
    } catch (err) {
      console.error('Error creando movimiento:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

   useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    } else if (session) {
      fetchMovements()
    }
  }, [session, isPending, router])

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/login')
  }

 if (isPending) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  if (!session) return null

  // Display LOADING
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="mt-4">Cargando movimientos...</p>
      </div>
    </div>
  )

 // Display error message 
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={fetchMovements}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">Sistema de Gestión</h1>
              <div className="flex space-x-4">
                <button 
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Inicio
                </button>
                <span className="text-blue-600 font-medium">Movimientos</span>
                <button className="text-gray-600 hover:text-gray-900">Usuarios</button>
                <button className="text-gray-600 hover:text-gray-900">Reportes</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Hola, {session.user.name}</span>
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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Gestión de Movimientos
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Nuevo Movimiento
            </button>
          </div>

          {/* Tabla de movimientos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.concept}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={movement.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                        {movement.type === 'INCOME' ? '+' : '-'}${movement.amount.toLocaleString()}
                      </span>
                    </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(movement.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        movement.type === 'INCOME' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal del formulario (mostrar si showForm es true) */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Nuevo Movimiento</h3>
                        <form onSubmit={createMovement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Concepto</label>
                  <input
                  name="concept"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Descripción del movimiento"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto</label>
                   <input
                  name="amount"
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  name="date"
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select name="type" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="INCOME">Ingreso</option>
                  <option value="EXPENSE">Egreso</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}