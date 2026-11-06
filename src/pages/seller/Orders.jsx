import { useCallback, useEffect, useState } from "react"
import SectionTitle from "../../components/ui/SectionTitle"
import StatusBadge from "../../components/ui/StatusBadge"
import Modal from "../../components/ui/Modal"
import Notice from "../../components/ui/Notice"
import PageLoader from "../../components/ui/PageLoader"
import ErrorMessage from "../../components/ui/ErrorMessage"
import OrderFilters from "../../components/seller/OrderFilters"
import OrdersTable from "../../components/seller/OrdersTable"
import usePagination from "../../hooks/usePagination"
import { getOrders, updateOrderStatus } from "../../services/orderService"
import { formatDateTime, formatPrice } from "../../utils/format"
import { filterOrders, nextOrderStatus } from "../../utils/orders"

const PAGE_SIZE = 8

export default function Orders() {
    // Pedidos del backend (GET /api/pedidos), del más reciente al más antiguo
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState("")

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("Todos")
    const [date, setDate] = useState("Todas")
    const [selectedIds, setSelectedIds] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [editMode, setEditMode] = useState(false)

    // Cambio de estado en curso y aviso de resultado ({ tone, text })
    const [updating, setUpdating] = useState(false)
    const [notice, setNotice] = useState(null)

    // Momento de referencia para "últimos N días". Se toma una sola vez al abrir la página:
    // leer la hora directamente durante el render haría que el resultado cambie entre renders.
    const [now] = useState(() => Date.now())

    const loadOrders = useCallback(
        () =>
            getOrders()
                .then((list) => {
                    setOrders(list)
                    setLoadError("")
                })
                .catch((error) => setLoadError(error.message))
                .finally(() => setLoading(false)),
        [],
    )

    useEffect(() => {
        loadOrders()
    }, [loadOrders])

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

    // Avanza el estado en el backend (PATCH /api/pedidos/{id}/estado) y reemplaza el pedido con la respuesta.
    // El backend solo acepta el estado siguiente: si no, responde 400 con el motivo.
    const changeStatus = async (order, newStatus) => {
        setUpdating(true)
        try {
            const updated = await updateOrderStatus(order.id, newStatus)
            setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)))
            setNotice({ tone: "success", text: `El pedido #${updated.id} quedó "${updated.estado}".` })
            setSelectedOrder(null)
        } catch (error) {
            setNotice({ tone: "error", text: error.message })
        } finally {
            setUpdating(false)
        }
    }

    const next = selectedOrder && nextOrderStatus(selectedOrder.estado)

    return (
        <>
            <title>Pedidos | Ferretería Los Maestros</title>

            <SectionTitle as="h1" size="page">
                Pedidos
            </SectionTitle>

            <p className="mt-2 text-sm text-slate-600 md:text-base">Gestiona los pedidos y su estado de seguimiento.</p>

            {notice && (
                <Notice tone={notice.tone} onClose={() => setNotice(null)}>
                    {notice.text}
                </Notice>
            )}

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

            {loading ? (
                <PageLoader text="Cargando pedidos..." />
            ) : loadError ? (
                <div className="mt-3">
                    <ErrorMessage onRetry={loadOrders}>{loadError}</ErrorMessage>
                </div>
            ) : (
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
                    onShip={(order) => changeStatus(order, "Enviado")}
                    total={total}
                    start={start}
                    end={end}
                />
            )}

            {/* Detalle o cambio de estado del pedido seleccionado */}
            <Modal
                open={selectedOrder !== null}
                onClose={() => setSelectedOrder(null)}
                title={editMode ? "Cambiar estado" : "Detalle del pedido"}
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
                                <p className="text-xs text-slate-500">{selectedOrder.clienteEmail}</p>
                            </div>

                            <div>
                                <p className="text-slate-500">Fecha</p>
                                <p className="mt-1 font-medium text-secondary">
                                    {formatDateTime(selectedOrder.fechaISO)}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Productos</p>
                                <ul className="mt-1 space-y-1 text-secondary">
                                    {selectedOrder.detalle.map((line) => (
                                        <li key={line.codigo} className="flex justify-between gap-4">
                                            <span>
                                                {line.cantidad} × {line.nombre}
                                            </span>
                                            <span className="whitespace-nowrap">{formatPrice(line.subtotal)}</span>
                                        </li>
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

                            {/* Solo se puede avanzar al estado siguiente (regla del backend) */}
                            {editMode && (
                                <p className="rounded-lg bg-slate-50 px-4 py-3 text-slate-600">
                                    {next
                                        ? `El siguiente paso es "${next}". Los pedidos no pueden retroceder ni saltarse un estado.`
                                        : "Este pedido ya fue entregado."}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 md:px-6">
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cerrar
                            </button>

                            {editMode && next && (
                                <button
                                    type="button"
                                    data-autofocus
                                    disabled={updating}
                                    onClick={() => changeStatus(selectedOrder, next)}
                                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                                >
                                    {updating ? "Guardando..." : `Cambiar a "${next}"`}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </>
    )
}
