import { useCallback, useEffect, useState } from "react"
import { Package, ShoppingCart, Users, CircleDollarSign } from "lucide-react"
import { formatPrice } from "../../utils/format"
import { getSummary } from "../../services/adminService"
import { getOrders } from "../../services/orderService"
import SectionTitle from "../../components/ui/SectionTitle"
import StatCard from "../../components/admin/StatCard"
import RecentOrders from "../../components/admin/RecentOrders"
import PageLoader from "../../components/ui/PageLoader"
import ErrorMessage from "../../components/ui/ErrorMessage"

export default function Dashboard() {
    // Indicadores (GET /api/admin/resumen) y los 5 pedidos más recientes (GET /api/pedidos?limit=5)
    const [summary, setSummary] = useState(null)
    const [orders, setOrders] = useState([])
    const [error, setError] = useState("")

    const load = useCallback(
        () =>
            Promise.all([getSummary(), getOrders({ limit: 5 })])
                .then(([summaryData, recentOrders]) => {
                    setSummary(summaryData)
                    setOrders(recentOrders)
                    setError("")
                })
                .catch((err) => setError(err.message)),
        [],
    )

    useEffect(() => {
        load()
    }, [load])

    // Indicadores calculados por el backend con los datos reales
    const stats = summary && [
        {
            icon: Package,
            label: "Productos en catálogo",
            value: String(summary.productos),
            // En vez de la variación, este indicador avisa cuántos productos hay que reponer
            detail: `${summary.productosBajoStock} con stock bajo o sin stock`,
        },
        {
            icon: ShoppingCart,
            label: "Pedidos del mes",
            value: String(summary.pedidosMes),
            trend: summary.variacionPedidos,
        },
        { icon: Users, label: "Usuarios registrados", value: String(summary.usuarios) },
        {
            icon: CircleDollarSign,
            label: "Ventas del mes",
            value: formatPrice(summary.ventasMes),
            trend: summary.variacionVentas,
        },
    ]

    return (
        <>
            <title>Panel de administración | Ferretería Los Maestros</title>

            <SectionTitle as="h1" size="page">
                Panel de administración
            </SectionTitle>
            <p className="mt-2 text-sm text-gray-600 md:text-base">
                Resumen general de tu tienda y actividad reciente.
            </p>

            {error ? (
                <div className="mt-6">
                    <ErrorMessage onRetry={load}>{error}</ErrorMessage>
                </div>
            ) : !summary ? (
                <PageLoader text="Cargando indicadores..." />
            ) : (
                <>
                    {/* Indicadores: 1 columna en móvil, 2 en tablet y escritorio, 4 desde 2xl */}
                    <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-4">
                        {stats.map((stat) => (
                            <StatCard key={stat.label} {...stat} />
                        ))}
                    </div>

                    <RecentOrders orders={orders} />
                </>
            )}
        </>
    )
}
