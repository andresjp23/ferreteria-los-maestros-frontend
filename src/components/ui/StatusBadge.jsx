// Color de cada estado.
// Las clases van escritas completas (no armadas con texto) para que Tailwind las detecte.
const styles = {
    // Pedidos
    "En preparación": "bg-orange-100 text-orange-700",
    Enviado: "bg-green-100 text-green-700",
    Entregado: "bg-blue-100 text-blue-700",
    // Stock
    "En stock": "bg-green-100 text-green-700",
    "Bajo stock": "bg-orange-100 text-orange-700",
    "Sin stock": "bg-red-100 text-red-700",
    // Estado de usuario
    Activo: "bg-green-100 text-green-700",
    Inactivo: "bg-red-100 text-red-700",
    // Rol de usuario
    Administrador: "bg-orange-100 text-orange-700",
    Vendedor: "bg-blue-100 text-blue-700",
    Cliente: "bg-violet-100 text-violet-700",
}

export default function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                styles[status] ?? "bg-gray-100 text-gray-600"
            }`}
        >
            {status}
        </span>
    )
}
