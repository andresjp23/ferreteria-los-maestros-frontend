import { api } from "./api"

// Checkout del cliente: solo se envían los códigos y las cantidades;
// el precio y el total los calcula el servidor
export const createOrder = (items) =>
    api.post("/pedidos", { items: items.map(({ id, cantidad }) => ({ id, cantidad })) })

// Vendedor y administrador: pedidos del más reciente al más antiguo (limit opcional, ej. 5)
export const getOrders = ({ limit } = {}) => api.get(limit ? `/pedidos?limit=${limit}` : "/pedidos")

// Vendedor: avanza el estado (En preparación → Enviado → Entregado)
export const updateOrderStatus = (id, estado) => api.patch(`/pedidos/${id}/estado`, { estado })
