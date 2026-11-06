import { api } from "./api"

// Gestión del catálogo (solo administrador): incluye el precio de compra
export const getAdminProducts = () => api.get("/admin/productos")
export const createProduct = (product) => api.post("/admin/productos", product)
export const updateProduct = (id, product) => api.put(`/admin/productos/${id}`, product)
export const deleteProduct = (id) => api.delete(`/admin/productos/${id}`)

// Indicadores del dashboard: productos, usuarios, pedidos y ventas del mes
export const getSummary = () => api.get("/admin/resumen")
