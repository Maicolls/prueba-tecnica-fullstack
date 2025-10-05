import {
    useState,
    useEffect
} from 'react'
import {
    useSession,
    authClient
} from '@/lib/auth/client'
import { useRouter } from 'next/router'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'



export default function ReportesPage() {
    const { data: session, isPending } = useSession()
    const router = useRouter()
    interface StatsData {
        totalIngresos: number
        totalEgresos: number
        saldo: number
        movimientosPorMes: Array<{
            mes: string
            ingresos: number
            egresos: number
        }>
    }

    const [stats, setStats] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Función para cargar estadísticas desde la API
    const fetchStats = async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('🚀 Cargando estadísticas...')
            const response = await fetch('/api/reports/stats')

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `HTTP ${response.status}`)
            }

            const data = await response.json()
            console.log('✅ Estadísticas cargadas:', data)

            setStats(data)
        } catch (err) {
            console.error('❌ Error cargando estadísticas:', err)
            setError(err instanceof Error ? err.message : 'Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/login')
        } else if (session) {
            fetchStats()
        }
    }, [session, isPending, router])

    // Función para logout DENTRO del componente
    const handleLogout = async () => {
        await authClient.signOut()
        router.push('/login')
    }
    // Función para descargar reporte en CSV
    // 📊 CSV Mejorado con mejor formato
    const downloadCSV = () => {
        if (!stats) return

        const fechaReporte = new Date().toLocaleDateString('es-ES')
        const csvData: (string | number)[][] = [
            // Encabezado del reporte
            ['REPORTE FINANCIERO - ' + fechaReporte],
            ['Generado por:', session?.user?.name || 'Usuario'],
            [''], // Línea vacía
            
            // Resumen ejecutivo
            ['=== RESUMEN EJECUTIVO ==='],
            ['Concepto', 'Monto (COP)', 'Porcentaje'],
            ['Total Ingresos', stats.totalIngresos.toLocaleString(), '100%'],
            ['Total Egresos', stats.totalEgresos.toLocaleString(), stats.totalIngresos > 0 ? ((stats.totalEgresos/stats.totalIngresos)*100).toFixed(1) + '%' : '0%'],
            ['Saldo Final', stats.saldo.toLocaleString(), stats.totalIngresos > 0 ? ((stats.saldo/stats.totalIngresos)*100).toFixed(1) + '%' : '0%'],
            [''], // Línea vacía
            
            // Desglose por mes
            ['=== MOVIMIENTOS POR MES ==='],
            ['Mes', 'Ingresos (COP)', 'Egresos (COP)', 'Balance Mensual'],
            ...stats.movimientosPorMes.map(item => [
                item.mes.charAt(0).toUpperCase() + item.mes.slice(1),
                item.ingresos.toLocaleString(),
                item.egresos.toLocaleString(),
                (item.ingresos - item.egresos).toLocaleString()
            ])
        ]

        // Convertir a CSV con UTF-8 BOM para Excel
        const csvContent = '\uFEFF' + csvData.map(row =>
            row.map(field => `"${String(field)}"`).join(',')
        ).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `reporte_financiero_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }



    // 📄 PDF-ready HTML (abre en nueva pestaña para imprimir)
    const downloadPDF = () => {
        if (!stats) return

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte Financiero</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #1f2937; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
                h2 { color: #374151; margin-top: 30px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
                th { background-color: #f3f4f6; font-weight: bold; }
                .positive { color: #059669; }
                .negative { color: #dc2626; }
                .footer { margin-top: 40px; font-size: 12px; color: #6b7280; }
            </style>
        </head>
        <body>
            <h1>Reporte Financiero</h1>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            <p><strong>Generado por:</strong> ${session?.user?.name || 'Usuario'}</p>
            
            <h2>Resumen Ejecutivo</h2>
            <table>
                <tr><th>Concepto</th><th>Monto (COP)</th><th>Porcentaje</th></tr>
                <tr><td>Total Ingresos</td><td class="positive">$${stats.totalIngresos.toLocaleString()}</td><td>100%</td></tr>
                <tr><td>Total Egresos</td><td class="negative">$${stats.totalEgresos.toLocaleString()}</td><td>${stats.totalIngresos > 0 ? ((stats.totalEgresos/stats.totalIngresos)*100).toFixed(1) : 0}%</td></tr>
                <tr><td>Saldo Final</td><td class="${stats.saldo >= 0 ? 'positive' : 'negative'}">$${stats.saldo.toLocaleString()}</td><td>${stats.totalIngresos > 0 ? ((stats.saldo/stats.totalIngresos)*100).toFixed(1) : 0}%</td></tr>
            </table>

            <h2>Movimientos por Mes</h2>
            <table>
                <tr><th>Mes</th><th>Ingresos</th><th>Egresos</th><th>Balance</th></tr>
                ${stats.movimientosPorMes.map(item => `
                    <tr>
                        <td>${item.mes.charAt(0).toUpperCase() + item.mes.slice(1)}</td>
                        <td class="positive">$${item.ingresos.toLocaleString()}</td>
                        <td class="negative">$${item.egresos.toLocaleString()}</td>
                        <td class="${(item.ingresos - item.egresos) >= 0 ? 'positive' : 'negative'}">$${(item.ingresos - item.egresos).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </table>

            <div class="footer">
                <p>Reporte generado automáticamente por Sistema de Gestión Financiera</p>
            </div>
        </body>
        </html>`

        const newWindow = window.open('', '_blank')
        if (newWindow) {
            newWindow.document.write(htmlContent)
            newWindow.document.close()
            // Auto-trigger print dialog
            setTimeout(() => newWindow.print(), 500)
        }
    }
    if (isPending) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
    if (!session) return null

    // 🎨 MOSTRAR LOADING
    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            <div className="text-center relative z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500/20 border-t-green-400 mx-auto"></div>
                <p className="mt-4 text-green-400 font-medium">Cargando estadísticas...</p>
            </div>
        </div>
    )

    // ❌ MOSTRAR ERROR
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
                    onClick={fetchStats}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                    Reintentar
                </button>
            </div>
        </div>
    )

    // Si no hay stats, usar datos de ejemplo como fallback
    const displayData = stats || {
        totalIngresos: 0,
        totalEgresos: 0,
        saldo: 0,
        movimientosPorMes: []
    }

    // UN SOLO RETURN
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Fondo animado */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <nav className="relative z-10 bg-black/40 backdrop-blur-xl border-b border-green-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Título y navegación */}
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center gap-3">
                                {/* Logo - Puedes reemplazar el div por tu imagen */}
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                                    {/* Opción 1: Con imagen personalizada */}
                                    {/* <img 
                                      src="/images/brand/logo.png" 
                                      alt="Logo" 
                                      className="w-8 h-8 object-contain"
                                    /> */}
                                    
                                    {/* Opción 2: Icono SVG actual (temporal) */}
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
                                <button 
                                    onClick={() => router.push('/usuarios')}
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Usuarios
                                </button>
                                <span className="text-green-400 font-medium">Reportes</span>
                            </div>
                        </div>
                        {/* Usuario y logout */}
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

            {/* Contenido principal */}
            <main className="relative z-10 max-w-7xl mx-auto py-6">
                <div className="px-4 py-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent mb-8">
                        Reportes y Estadísticas
                    </h2>
                    {/* Tarjetas de resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Tarjeta de Ingresos */}
                        <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 p-6 rounded-2xl hover:border-green-500/40 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider mb-2">
                                        Total Ingresos
                                    </h3>
                                    <p className="text-3xl font-bold text-green-300">
                                        ${displayData.totalIngresos.toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Egresos */}
                        <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 p-6 rounded-2xl hover:border-red-500/40 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-red-400 uppercase tracking-wider mb-2">
                                        Total Egresos
                                    </h3>
                                    <p className="text-3xl font-bold text-red-300">
                                        ${displayData.totalEgresos.toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Saldo */}
                        <div className="bg-black/40 backdrop-blur-xl border border-blue-500/20 p-6 rounded-2xl hover:border-blue-500/40 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-2">
                                        Saldo Actual
                                    </h3>
                                    <p className="text-3xl font-bold text-blue-300">
                                        ${displayData.saldo.toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 p-6 rounded-2xl mb-8">
                        <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                            Movimientos por Mes
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={displayData.movimientosPorMes}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#22c55e20" />
                                    <XAxis dataKey="mes" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            `$${value.toLocaleString()}`,
                                            name === 'ingresos' ? 'Ingresos' : 'Egresos'
                                        ]}
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            border: '1px solid rgba(34, 197, 94, 0.2)',
                                            borderRadius: '12px',
                                            color: '#ffffff'
                                        }}
                                    />
                                    <Bar dataKey="ingresos" fill="#22c55e" name="ingresos" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="egresos" fill="#ef4444" name="egresos" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* 📥 OPCIONES DE EXPORTACIÓN MEJORADAS */}
                    <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 p-6 rounded-2xl">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                                📊 Exportar Reporte
                            </h3>
                            <p className="text-gray-400 mt-1">Elige el formato que necesites para tu reporte</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CSV - Excel */}
                            <div className="bg-black/30 border border-green-500/30 rounded-xl p-6 hover:border-green-400 transition-all duration-300 hover:bg-green-500/5">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-white">CSV / Excel</h4>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Formato compatible con Excel y Google Sheets
                                </p>
                                <button
                                    onClick={downloadCSV}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                >
                                    Descargar CSV
                                </button>
                            </div>

                            {/* PDF - Impresión */}
                            <div className="bg-black/30 border border-red-500/30 rounded-xl p-6 hover:border-red-400 transition-all duration-300 hover:bg-red-500/5">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-white">PDF / Imprimir</h4>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                    Vista optimizada para impresión
                                </p>
                                <button
                                    onClick={downloadPDF}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                >
                                    Ver PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}