import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@/lib/auth/client'
import Head from 'next/head'

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
    <>
      <Head>
        <link 
          rel="stylesheet" 
          type="text/css" 
          href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" 
        />
        <style jsx global>{`
          .swagger-ui {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .swagger-ui .topbar {
            display: none;
          }
          .swagger-ui .info {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .swagger-ui .info .title {
            color: #22c55e;
          }
          .swagger-ui .info .description {
            color: #e5e7eb;
          }
          .swagger-ui .scheme-container {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
            padding: 10px;
            margin-bottom: 20px;
          }
          .swagger-ui .opblock {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
            margin-bottom: 15px;
          }
          .swagger-ui .opblock-summary {
            color: #e5e7eb;
          }
          .swagger-ui .opblock-summary-method {
            background: #22c55e;
            color: white;
            border-radius: 6px;
          }
          .swagger-ui .opblock-summary-path {
            color: #22c55e;
          }
          .swagger-ui .opblock-description-wrapper p {
            color: #d1d5db;
          }
          .swagger-ui .opblock-section-header {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
          }
          .swagger-ui .parameters-col_description input {
            background: rgba(0, 0, 0, 0.8);
            color: #e5e7eb;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }
          .swagger-ui .btn.try-out__btn {
            background: #22c55e;
            color: white;
            border: none;
            border-radius: 6px;
          }
          .swagger-ui .btn.execute {
            background: #059669;
            color: white;
            border: none;
            border-radius: 6px;
          }
          .swagger-ui .responses-wrapper {
            background: rgba(0, 0, 0, 0.6);
            border-radius: 8px;
            padding: 15px;
          }
          .swagger-ui .response {
            color: #e5e7eb;
          }
          .swagger-ui table {
            background: rgba(0, 0, 0, 0.6);
            color: #e5e7eb;
          }
          .swagger-ui table th {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
          }
          .swagger-ui .model-box {
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(34, 197, 94, 0.2);
            color: #e5e7eb;
          }
          .swagger-ui .model .property {
            color: #d1d5db;
          }
          .swagger-ui .model .property.primitive {
            color: #22c55e;
          }
        `}</style>
      </Head>
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
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500/20 border-t-green-400 mx-auto mb-4"></div>
            <div className="text-green-400 font-medium">Cargando documentación...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-red-400 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {SwaggerUI && !isLoading && !error && (
          <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl overflow-hidden p-6">
            <SwaggerUI 
              url="/api/docs"
              docExpansion="list"
              defaultModelsExpandDepth={2}
              tryItOutEnabled={true}
              displayRequestDuration={true}
              filter={true}
              showExtensions={true}
              showCommonExtensions={true}
              deepLinking={true}
              displayOperationId={false}
              defaultModelExpandDepth={3}
              defaultModelRendering="example"
              presets={[]}
              plugins={[]}
              supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
            />
          </div>
        )}
      </div>
    </div>
    </>
  )
}
