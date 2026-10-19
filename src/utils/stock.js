// Hasta esta cantidad de unidades, un producto se considera "Bajo stock".
// En la fase 2 se reemplaza por el stock mínimo de cada producto, que vendrá del backend.
export const LOW_STOCK_THRESHOLD = 10

// Estado de un producto según su stock
export const getStockStatus = (stock) => {
    if (stock <= 0) return "Sin stock"
    if (stock <= LOW_STOCK_THRESHOLD) return "Bajo stock"
    return "En stock"
}

// Opciones del filtro de estado
export const stockStatuses = ["En stock", "Bajo stock", "Sin stock"]