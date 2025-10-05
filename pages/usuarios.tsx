import { useState, useEffect } from 'react'
import { useSession, authClient } from '@/lib/auth/client'
import { useRouter } from 'next/router'

// type for user
interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'USER' | 'ADMIN'
}

export default function UsuariosPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para cargar usuarios desde la API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🚀 Iniciando fetch a /api/users...')
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📡 Respuesta recibida:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: Error al cargar usuarios`)
      }
      
      const data = await response.json()
      console.log('✅ Datos recibidos:', data)
      
      setUsers(data.users || [])
      setError(null)
    } catch (err) {
      console.error(' Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    } else if (session) {
      fetchUsers()
    }
  }, [session, isPending, router])

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/login')
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowEditForm(true)
  }

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (editingUser) {
      try {
        // 🚀 AQUÍ ES DONDE ENVIAMOS A LA API
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingUser.id,
            name: formData.get('name') as string,
            role: formData.get('role') as 'USER' | 'ADMIN'
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al actualizar usuario')
        }

        // ✅ SI TODO SALE BIEN, recargar la lista
        await fetchUsers()
        setShowEditForm(false)
        setEditingUser(null)
        
      } catch (err) {
        console.error('Error updating user:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      }
    }
  }

  if (isPending) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  if (!session) return null

  // 🎨 MOSTRAR LOADING MIENTRAS CARGA USUARIOS
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="mt-4">Cargando usuarios...</p>
      </div>
    </div>
  )

  // ❌ MOSTRAR ERROR SI HAY PROBLEMAS
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Navegación */}
      <nav className="relative z-10 bg-black/40 backdrop-blur-xl border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  Sistema de Gestión
                </h1>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => router.push('/')}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Inicio
                </button>
                <button 
                  onClick={() => router.push('/movimientos')}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Movimientos
                </button>
                <span className="text-green-400 font-medium">Usuarios</span>
                <button 
                  onClick={() => router.push('/reportes')}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Reportes
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">
                  Hola, <span className="text-green-400 font-medium">{session.user.name}</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent mb-2">
              Gestión de Usuarios
            </h2>
            <p className="text-gray-400">
              Administra los usuarios del sistema y sus roles
            </p>
          </div>

          {/* Tabla de usuarios */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || 'No especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal del formulario de edición */}
      {showEditForm && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Editar Usuario</h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={editingUser.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo</label>
                <input
                  type="email"
                  defaultValue={editingUser.email}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select 
                  name="role"
                  defaultValue={editingUser.role}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}