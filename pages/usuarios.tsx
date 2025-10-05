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

  //Function to load users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Iniciando fetch a /api/users...')
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log(' Respuesta recibida:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: Error al cargar usuarios`)
      }
      
      const data = await response.json()
      console.log(' Datos recibidos:', data)
      
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
        // Send information to API
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

        // Update to reload the list
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

  // Display loading while fetching users
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="text-center relative z-10">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500/20 border-t-green-400 mx-auto"></div>
        <p className="mt-4 text-green-400 font-medium">Cargando usuarios...</p>
      </div>
    </div>
  )

  // Display error if there are issues
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="text-center relative z-10 bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md mx-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-400 mb-4">Error: {error}</p>
        <button 
          onClick={fetchUsers}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
        >
          Reintentar
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">

      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Navigation */}
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

          {/* Table of users */}
          <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-green-500/20">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-500/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-green-500/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.phone || 'No especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
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

      {/* Modal form for editing user */}
      {showEditForm && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-xl border border-green-500/20 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
              Editar Usuario
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Nombre</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={editingUser.name}
                  className="w-full bg-black/50 border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Correo</label>
                <input
                  type="email"
                  defaultValue={editingUser.email}
                  className="w-full bg-black/30 border border-green-500/20 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-2">El correo no se puede modificar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Rol</label>
                <select 
                  name="role"
                  defaultValue={editingUser.role}
                  className="w-full bg-black/50 border border-green-500/30 rounded-xl px-4 py-3 text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all"
                >
                  <option value="USER" className="bg-gray-800">Usuario</option>
                  <option value="ADMIN" className="bg-gray-800">Administrador</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-3 border border-green-500/30 rounded-xl text-gray-300 hover:bg-green-500/10 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
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