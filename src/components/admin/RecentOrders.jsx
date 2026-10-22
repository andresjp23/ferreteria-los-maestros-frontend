import { orders } from "../../mocks/orders"
import { formatPrice } from "../../utils/format"
import SectionTitle from "../ui/SectionTitle"
import StatusBadge from "../ui/StatusBadge"

export default function RecentOrders() {
    return (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
            <div className="mb-5">
                <SectionTitle>Pedidos recientes</SectionTitle>
            </div>

            <ul className="grid gap-3 xl:hidden" aria-label="Pedidos recientes">
                {orders.map((order) => (
                    <li key={order.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium text-gray-500">N° Pedido</p>
                                <p className="mt-1 font-semibold text-secondary">#{order.id}</p>
                            </div>
                            <StatusBadge status={order.estado} />
                        </div>

                        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="min-w-0">
                                <dt className="text-xs font-medium text-gray-500">Cliente</dt>
                                <dd className="mt-1 truncate text-gray-700">{order.cliente}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-gray-500">Fecha</dt>
                                <dd className="mt-1 text-gray-700">{order.fecha}</dd>
                            </div>
                        </dl>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                            <span className="text-sm text-gray-500">Total</span>
                            <span className="font-semibold text-secondary">{formatPrice(order.total)}</span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* La tabla se mantiene en escritorio, donde caben todas las columnas. */}
            <div className="hidden overflow-x-auto xl:block">
                <table className="w-full min-w-136 text-left text-sm">
                    <thead className="bg-slate-50 text-gray-500">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-medium">
                                N° Pedido
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Cliente
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Fecha
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Estado
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 last:border-0">
                                <td className="px-4 py-4 font-semibold text-secondary">#{order.id}</td>
                                <td className="px-4 py-4 text-gray-700">{order.cliente}</td>
                                <td className="px-4 py-4 text-gray-500">{order.fecha}</td>
                                <td className="px-4 py-4">
                                    <StatusBadge status={order.estado} />
                                </td>
                                <td className="px-4 py-4 font-medium text-secondary">{formatPrice(order.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
