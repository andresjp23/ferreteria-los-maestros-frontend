import { api } from "./api"

// Checkout: solo se envían los códigos y las cantidades; el precio y el total los calcula el servidor
export const createOrder = (items) =>
    api.post("/pedidos", { items: items.map(({ id, cantidad }) => ({ id, cantidad })) })
