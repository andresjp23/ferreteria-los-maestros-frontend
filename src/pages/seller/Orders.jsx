
import { useMemo, useState } from "react"
import { X } from "lucide-react"
import { orders as initialOrders } from "../../mocks/orders"
import SectionTitle from "../../components/admin/SectionTitle"
import OrderFilters from "../../components/seller/OrderFilters"
import OrdersTable from "../../components/seller/OrdersTable"
import StatusBadge from "../../components/admin/StatusBadge"
import { formatPrice } from "../../utils/format"

const PAGE_SIZE = 8

export default function Orders() {
    const [orders, setOrders] = useState(initialOrders)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("Todos")
    const [date, setDate] = useState("Todas")
    const [page, setPage] = useState(1)
    const [selectedIds, setSelectedIds] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [editMode, setEditMode] = useState(false)

    const filteredOrders = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        return orders.filter((order) => {
            const matchesSearch =
                String(order.id).includes(normalizedSearch) ||
                order.cliente.toLowerCase().includes(normalizedSearch) ||
                (order.productos ?? []).some((product) =>
                    product.toLowerCase().includes(normalizedSearch)
                )

            const matchesStatus =
                status === "Todos" || order.estado === status

            const days = Number(date)
            const matchesDate =
                date === "Todas" ||
                (order.fechaISO &&
                    (Date.now() - new Date(order.fechaISO).getTime()) /
                        (1000 * 60 * 60 * 24) <= days &&
                    new Date(order.fechaISO).getTime() <= Date.now())

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [orders, search, status, date])

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)

    const pageOrders = filteredOrders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    const start = filteredOrders.length === 0
        ? 0
        : (currentPage - 1) * PAGE_SIZE + 1

    const end = Math.min(currentPage * PAGE_SIZE, filteredOrders.length)

    const clearFilters = () => {
        setSearch("")
        setStatus("Todos")
        setDate("Todas")
        setPage(1)
        setSelectedIds([])
    }

    const toggleOrder = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((selectedId) => selectedId !== id)
                : [...current, id]
        )
    }

    const toggleAll = () => {
        const pageIds = pageOrders.map((order) => order.id)
        const allSelected = pageIds.every((id) => selectedIds.includes(id))

        setSelectedIds((current) =>
            allSelected
                ? current.filter((id) => !pageIds.includes(id))
                : [...new Set([...current, ...pageIds])]
        )
    }

    const openOrder = (order, editing = false) => {
        setSelectedOrder(order)
        setEditMode(editing)
    }

    const updateStatus = (newStatus) => {
        setOrders((current) =>
            current.map((order) =>
                order.id === selectedOrder.id
                    ? { ...order, estado: newStatus }
                    : order
            )
        )

        setSelectedOrder((current) => ({
            ...current,
            estado: newStatus,
        }))

        setEditMode(false)
    }

    const markAsSent = (order) => {
        setOrders((current) =>
            current.map((item) =>
                item.id === order.id
                    ? { ...item, estado: "Enviado" }
                    : item
            )
        )
    }

    return (
        <>
            <title>Pedidos | Ferretería Los Maestros</title>

            <SectionTitle as="h1" size="page">
                Pedidos
            </SectionTitle>

            <p className="mt-2 text-sm text-slate-600 md:text-base">
                Gestiona los pedidos y su estado de seguimiento.
            </p>

            <div className="mt-6">
                <OrderFilters
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value)
                        setPage(1)
                    }}
                    status={status}
                    onStatusChange={(value) => {
                        setStatus(value)
                        setPage(1)
                    }}
                    date={date}
                    onDateChange={(value) => {
                        setDate(value)
                        setPage(1)
                    }}
                    onClear={clearFilters}
                />
            </div>

            <OrdersTable
                orders={pageOrders}
                selectedIds={selectedIds}
                onToggle={toggleOrder}
                onToggleAll={toggleAll}
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                onView={(order) => openOrder(order)}
                onEdit={(order) => openOrder(order, true)}
                onShip={markAsSent}
                total={filteredOrders.length}
                start={start}
                end={end}
            />

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="order-modal-title"
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Pedido #{selectedOrder.id}
                                </p>
                                <h2
                                    id="order-modal-title"
                                    className="mt-1 text-xl font-bold text-secondary"
                                >
                                    {editMode ? "Editar estado" : "Detalle del pedido"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                aria-label="Cerrar"
                                className="text-slate-500 hover:text-secondary"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4 text-sm">
                            <div>
                                <p className="text-slate-500">Cliente</p>
                                <p className="mt-1 font-medium text-secondary">
                                    {selectedOrder.cliente}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Fecha</p>
                                <p className="mt-1 font-medium text-secondary">
                                    {selectedOrder.fecha}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Productos</p>
                                <ul className="mt-1 list-inside list-disc text-secondary">
                                    {(selectedOrder.productos ?? ["Sin detalle de productos"]).map(
                                        (product, index) => (
                                            <li key={`${product}-${index}`}>{product}</li>
                                        )
                                    )}
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
                                    <span className="mb-2 block font-medium text-secondary">
                                        Cambiar estado
                                    </span>

                                    <select
                                        value={selectedOrder.estado}
                                        onChange={(event) => updateStatus(event.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-primary"
                                    >
                                        <option value="En preparación">En preparación</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Entregado">Entregado</option>
                                    </select>
                                </label>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Cerrar
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}
