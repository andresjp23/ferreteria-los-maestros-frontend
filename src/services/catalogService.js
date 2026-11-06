import { api } from "./api"

// Catálogo público: no necesita sesión
export const getProducts = () => api.get("/productos")
export const getCategories = () => api.get("/categorias")
export const getBrands = () => api.get("/marcas")
export const getUnits = () => api.get("/unidades")
