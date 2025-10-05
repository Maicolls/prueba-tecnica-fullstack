import { useState } from 'react'
import { authClient } from '@/lib/auth/client'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/'
      })
    } catch (error) {
      console.error('Error al hacer login:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
            <h1 className="mt-6 text-center text-3 font-extrabold text-black-900">
                Bienvenid@
            </h1>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
             Iniciar Sesión
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
             Sistema de Gestión de Ingresos y Egresos
            </p>
        </div>
        <div>
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Continuar con GitHub'}
          </button>
        </div>
      </div>
    </div>
  )
}