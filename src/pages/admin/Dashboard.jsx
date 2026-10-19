import { Package, ShoppingCart, Users, CircleDollarSign } from "lucide-react"
import { products } from "../../mocks/products"
import { formatPrice } from "../../utils/format"
import SectionTitle from "../../components/admin/SectionTitle"
import StatCard from "../../components/admin/StatCard"
import RecentOrders from "../../components/admin/RecentOrders"
import {adminUsers} from "../../mocks/adminUsers"

// Indicadores. Solo "Productos en catálogo" es real (sale del catálogo);
// los demás son de ejemplo hasta que haya backend.
const stats = [
    { icon: Package, label: "Productos en catálogo", value: String(products.length), trend: "+12%" },
    { icon: ShoppingCart, label: "Pedidos del mes", value: "248", trend: "+18%" },
    { icon: Users, label: "Usuarios registrados", value: String(adminUsers.length), trend: "+10%" },
    { icon: CircleDollarSign, label: "Ventas del mes", value: formatPrice(4892360), trend: "+22%" },
]

export default function Dashboard() {
    return (
        <>
            <title>Panel de administración | Ferretería Los Maestros</title>

            <SectionTitle as="h1" size="page">Panel de administración</SectionTitle>
            <p className="mt-2 text-sm text-gray-600 md:text-base">
                Resumen general de tu tienda y actividad reciente.
            </p>

            {/* Indicadores: 1 columna en móvil, 2 en tablet y escritorio, 4 desde 2xl */}
            <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <RecentOrders />
        </>
    )
}