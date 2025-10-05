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
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="mt-4">Cargando estadísticas...</p>
            </div>
        </div>
    )

    // ❌ MOSTRAR ERROR
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-red-600">
                <p>Error: {error}</p>
                <button
                    onClick={fetchStats}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
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
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Título y navegación */}
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-semibold">Sistema de Gestión</h1>
                            <div className="flex space-x-4">
                                <button onClick={() => router.push('/')}>Inicio</button>
                                <button onClick={() => router.push('/movimientos')}>Movimientos</button>
                                <button onClick={() => router.push('/usuarios')}>Usuarios</button>
                                <span className="text-blue-600 font-medium">Reportes</span>
                            </div>
                        </div>
                        {/* Usuario y logout */}
                        <div className="flex items-center space-x-4">
                            <span>Hola, {session.user.name}</span>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto py-6">
                <div className="px-4 py-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reportes y Estadísticas</h2>
                    {/* Tarjetas de resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Tarjeta de Ingresos */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Total Ingresos
                                    </h3>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${displayData.totalIngresos.toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 font-bold">↗</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Egresos */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Total Egresos
                                    </h3>
                                    <p className="text-2xl font-bold text-red-600">
                                        ${displayData.totalEgresos.toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-red-600 font-bold">↘</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Saldo */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Saldo Actual
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${displayData.saldo.toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold">💰</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <h3 className="text-lg font-medium mb-4">Movimientos por Mes</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={displayData.movimientosPorMes}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            `$${value.toLocaleString()}`,
                                            name === 'ingresos' ? 'Ingresos' : 'Egresos'
                                        ]}
                                    />
                                    <Bar dataKey="ingresos" fill="#10B981" name="ingresos" />
                                    <Bar dataKey="egresos" fill="#EF4444" name="egresos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* 📥 OPCIONES DE EXPORTACIÓN MEJORADAS */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">📊 Exportar Reporte</h3>
                            <p className="text-gray-600 mt-1">Elige el formato que necesites para tu reporte</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CSV - Excel */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">📊</span>
                                    <h4 className="font-medium">CSV / Excel</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Formato compatible con Excel y Google Sheets
                                </p>
                                <button
                                    onClick={downloadCSV}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Descargar CSV
                                </button>
                            </div>

                            {/* PDF - Impresión */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">🖨️</span>
                                    <h4 className="font-medium">PDF / Imprimir</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Vista optimizada para impresión
                                </p>
                                <button
                                    onClick={downloadPDF}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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