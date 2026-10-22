import { matchesAllWords } from "./format"

// Estados de un pedido, en el orden en que avanza
export const orderStatuses = ["En preparación", "Enviado", "Entregado"]

const DAY_MS = 1000 * 60 * 60 * 24

// Filtra pedidos por texto (n°, cliente o producto), estado y antigüedad en días.
// "now" se recibe como parámetro para que la función sea pura y fácil de probar.
export const filterOrders = (orders, { search, status, days, now }) =>
    orders.filter((order) => {
        const text = `${order.id} ${order.cliente} ${(order.productos ?? []).join(" ")}`
        const matchesStatus = status === "Todos" || order.estado === status

        const time = order.fechaISO ? new Date(order.fechaISO).getTime() : null
        const matchesDate = days === "Todas" || (time !== null && time <= now && (now - time) / DAY_MS <= Number(days))

        return matchesAllWords(text, search) && matchesStatus && matchesDate
    })
