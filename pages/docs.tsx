import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@/lib/auth/client'

export default function DocsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [SwaggerUI, setSwaggerUI] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
      return
    }

    // Cargar Swagger UI solo en el cliente
    if (typeof window !== 'undefined') {
      setIsLoading(true)
      import('swagger-ui-react')
        .then((SwaggerModule) => {
          setSwaggerUI(() => SwaggerModule.default)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error('Error loading Swagger UI:', err)
          setError('Error al cargar la documentación')
          setIsLoading(false)
        })
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documentación de API</h1>
              <p className="text-gray-600">Sistema de Gestión de Ingresos y Egresos</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500">Cargando documentación...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-500">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {SwaggerUI && !isLoading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <SwaggerUI 
              url="/api/docs"
              docExpansion="list"
              defaultModelsExpandDepth={2}
              tryItOutEnabled={true}
              displayRequestDuration={true}
              filter={true}
              showExtensions={true}
              showCommonExtensions={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
