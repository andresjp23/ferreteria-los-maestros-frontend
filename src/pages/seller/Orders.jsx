import { useState } from "react"
import { orders as initialOrders } from "../../mocks/orders"
import SectionTitle from "../../components/ui/SectionTitle"
import StatusBadge from "../../components/ui/StatusBadge"
import Modal from "../../components/ui/Modal"
import OrderFilters from "../../components/seller/OrderFilters"
import OrdersTable from "../../components/seller/OrdersTable"
import usePagination from "../../hooks/usePagination"
import { formatPrice } from "../../utils/format"
import { filterOrders, orderStatuses } from "../../utils/orders"

const PAGE_SIZE = 8

export default function Orders() {
    const [orders, setOrders] = useState(initialOrders)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("Todos")
    const [date, setDate] = useState("Todas")
    const [selectedIds, setSelectedIds] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [editMode, setEditMode] = useState(false)

    // Momento de referencia para "últimos N días". Se toma una sola vez al abrir la página:
    // leer la hora directamente durante el render haría que el resultado cambie entre renders.
    const [now] = useState(() => Date.now())

    const filteredOrders = filterOrders(orders, { search: search.trim(), status, days: date, now })

    // Paginación: si cambia algún filtro, vuelve a la página 1
    const {
        page,
        totalPages,
        pageItems: pageOrders,
        setPage,
        start,
        end,
        total,
    } = usePagination(filteredOrders, {
        pageSize: PAGE_SIZE,
        resetKey: `${search}|${status}|${date}`,
    })

    const clearFilters = () => {
        setSearch("")
        setStatus("Todos")
        setDate("Todas")
        setSelectedIds([])
    }

    const toggleOrder = (id) => {
        setSelectedIds((current) =>
            current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
        )
    }

    const toggleAll = () => {
        const pageIds = pageOrders.map((order) => order.id)
        const allSelected = pageIds.every((id) => selectedIds.includes(id))

        setSelectedIds((current) =>
            allSelected ? current.filter((id) => !pageIds.includes(id)) : [...new Set([...current, ...pageIds])],
        )
    }

    const openOrder = (order, editing = false) => {
        setSelectedOrder(order)
        setEditMode(editing)
    }

    const updateStatus = (newStatus) => {
        setOrders((current) =>
            current.map((order) => (order.id === selectedOrder.id ? { ...order, estado: newStatus } : order)),
        )

        setSelectedOrder((current) => ({
            ...current,
            estado: newStatus,
        }))

        setEditMode(false)
    }

    const markAsSent = (order) => {
        setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, estado: "Enviado" } : item)))
    }

    return (
        <>
            <title>Pedidos | Ferretería Los Maestros</title>

            <SectionTitle as="h1" size="page">
                Pedidos
            </SectionTitle>

            <p className="mt-2 text-sm text-slate-600 md:text-base">Gestiona los pedidos y su estado de seguimiento.</p>

            <div className="mt-6">
                <OrderFilters
                    search={search}
                    onSearchChange={setSearch}
                    status={status}
                    onStatusChange={setStatus}
                    date={date}
                    onDateChange={setDate}
                    onClear={clearFilters}
                />
            </div>

            <OrdersTable
                orders={pageOrders}
                selectedIds={selectedIds}
                onToggle={toggleOrder}
                onToggleAll={toggleAll}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onView={(order) => openOrder(order)}
                onEdit={(order) => openOrder(order, true)}
                onShip={markAsSent}
                total={total}
                start={start}
                end={end}
            />

            {/* Detalle o edición del pedido seleccionado */}
            <Modal
                open={selectedOrder !== null}
                onClose={() => setSelectedOrder(null)}
                title={editMode ? "Editar estado" : "Detalle del pedido"}
            >
                {selectedOrder && (
                    <>
                        <div className="space-y-4 overflow-y-auto px-5 py-5 text-sm md:px-6">
                            <div>
                                <p className="text-slate-500">N° de pedido</p>
                                <p className="mt-1 font-medium text-secondary">#{selectedOrder.id}</p>
                            </div>

                            <div>
                                <p className="text-slate-500">Cliente</p>
                                <p className="mt-1 font-medium text-secondary">{selectedOrder.cliente}</p>
                            </div>

                            <div>
                                <p className="text-slate-500">Fecha</p>
                                <p className="mt-1 font-medium text-secondary">{selectedOrder.fecha}</p>
                            </div>

                            <div>
                                <p className="text-slate-500">Productos</p>
                                <ul className="mt-1 list-inside list-disc text-secondary">
                                    {(selectedOrder.productos ?? ["Sin detalle de productos"]).map((product, index) => (
                                        <li key={`${product}-${index}`}>{product}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <p className="text-slate-500">Total</p>
                                <p className="mt-1 text-lg font-bold text-primary">
                                    {formatPrice(selectedOrder.total)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-slate-500">Estado actual</p>
                                <StatusBadge status={selectedOrder.estado} />
                            </div>

                            {editMode && (
                                <label className="block">
                                    <span className="mb-2 block font-medium text-secondary">Cambiar estado</span>

                                    <select
                                        data-autofocus
                                        value={selectedOrder.estado}
                                        onChange={(event) => updateStatus(event.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-primary"
                                    >
                                        {orderStatuses.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-gray-200 px-5 py-4 md:px-6">
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Cerrar
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </>
    )
}
