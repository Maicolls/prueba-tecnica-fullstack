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
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-ping"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* main Card  */}
          <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 shadow-2xl">
            {/* Logo/Icono */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center p-2">
                <img 
                  src="/images/logos/Logo.png" 
                  alt="Logo Sistema de Gestión" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Titles */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent mb-2">
                Bienvenido
              </h1>
              <h2 className="text-xl font-semibold text-gray-200 mb-3">
                Sistema de Gestión Financiera
              </h2>
              <p className="text-gray-400 text-sm">
                Controla tus ingresos y egresos de manera inteligente
              </p>
            </div>

            {/* Login button */}
            <div className="space-y-4">
              <button
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.291 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 11.987 24 5.367 18.633.001 12.017.001z"/>
                    </svg>
                    Continuar con GitHub
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Footer info */}
            <div className="mt-8 pt-6 border-t border-green-500/20 text-center">
              <p className="text-gray-400 text-xs">
                Autenticación segura mediante GitHub OAuth
              </p>
            </div>
          </div>

          {/* additional text */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿Primera vez? No te preocupes, se creará tu cuenta automáticamente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}