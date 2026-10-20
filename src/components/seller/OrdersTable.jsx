
import { Eye, Pencil, Truck } from "lucide-react"
import StatusBadge from "../admin/StatusBadge"
import Pagination from "../admin/Pagination"
import { formatPrice } from "../../utils/format"

export default function OrdersTable({
    orders,
    selectedIds,
    onToggle,
    onToggleAll,
    page,
    totalPages,
    onPageChange,
    onView,
    onEdit,
    onShip,
    total,
    start,
    end,
}) {
    const allSelected =
        orders.length > 0 && orders.every((order) => selectedIds.includes(order.id))

    return (
        <section className="mt-3 rounded-xl border border-blue-100 bg-white p-4 md:p-5">
            <div className="overflow-x-auto">
                <table className="w-full min-w-212.5 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="w-12 rounded-l-lg px-3 py-3">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onToggleAll}
                                    aria-label="Seleccionar todos los pedidos de esta página"
                                    className="size-4 accent-primary"
                                />
                            </th>
                            <th className="px-3 py-3 font-medium">N° Pedido</th>
                            <th className="px-3 py-3 font-medium">Cliente</th>
                            <th className="px-3 py-3 font-medium">Fecha</th>
                            <th className="px-3 py-3 font-medium">Total</th>
                            <th className="px-3 py-3 font-medium">Estado</th>
                            <th className="rounded-r-lg px-3 py-3 text-center font-medium">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                            >
                                <td className="px-3 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(order.id)}
                                        onChange={() => onToggle(order.id)}
                                        aria-label={`Seleccionar pedido ${order.id}`}
                                        className="size-4 accent-primary"
                                    />
                                </td>

                                <td className="px-3 py-4 font-semibold text-secondary">
                                    #{order.id}
                                </td>

                                <td className="px-3 py-4 text-secondary">
                                    {order.cliente}
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                                    {order.fecha}
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 font-semibold text-secondary">
                                    {formatPrice(order.total)}
                                </td>

                                <td className="px-3 py-4">
                                    <StatusBadge status={order.estado} />
                                </td>

                                <td className="px-3 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onView(order)}
                                            title="Ver pedido"
                                            aria-label={`Ver pedido ${order.id}`}
                                            className="text-slate-500 hover:text-primary"
                                        >
                                            <Eye className="size-5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onEdit(order)}
                                            title="Editar estado"
                                            aria-label={`Editar pedido ${order.id}`}
                                            className="text-slate-500 hover:text-primary"
                                        >
                                            <Pencil className="size-5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onShip(order)}
                                            disabled={order.estado !== "En preparación"}
                                            title="Marcar como enviado"
                                            aria-label={`Marcar pedido ${order.id} como enviado`}
                                            className="text-slate-500 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <Truck className="size-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {orders.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-12 text-center text-slate-500"
                                >
                                    No se encontraron pedidos con esos filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                    Mostrando {start}-{end} de {total} pedidos
                </p>

                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </section>
    )
}
