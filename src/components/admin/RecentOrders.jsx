import { orders } from "../../mocks/orders"
import { formatPrice } from "../../utils/format"
import SectionTitle from "./SectionTitle"
import StatusBadge from "./StatusBadge"

export default function RecentOrders() {
    return (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
            <div className="mb-5">
                <SectionTitle>Pedidos recientes</SectionTitle>
            </div>

            {/* La tabla se desplaza hacia el costado DENTRO de la tarjeta si no cabe (móvil),
                así la página nunca tiene scroll horizontal */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-136 text-left text-sm">
                    <thead className="bg-slate-50 text-gray-500">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-medium">N° Pedido</th>
                            <th scope="col" className="px-4 py-3 font-medium">Cliente</th>
                            <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
                            <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                            <th scope="col" className="px-4 py-3 font-medium">Total</th>
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
                                <td className="px-4 py-4 font-medium text-secondary">
                                    {formatPrice(order.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}