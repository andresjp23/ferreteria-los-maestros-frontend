// Datos de prueba con la misma forma que responde el backend

export const categories = [
    { id: "herramientas", nombre: "Herramientas" },
    { id: "materiales-construccion", nombre: "Materiales de construcción" },
]

export const brands = ["Bosch", "Makita", "Polpaico"]

const product = (id, nombre, categoria, categoriaNombre, marca, precio, stock) => ({
    id,
    nombre,
    categoria,
    categoriaNombre,
    subcategoria: "General",
    marca,
    unidad: "Unidad",
    precio,
    stock,
    stockMinimo: 10,
    descripcion: "",
    image: "/products/ejemplo.webp",
    estadoStock: stock === 0 ? "Sin stock" : stock <= 10 ? "Bajo stock" : "En stock",
})

export const products = [
    product("HE001", "Taladro percutor 650W 13mm", "herramientas", "Herramientas", "Bosch", 79990, 8),
    product("HE002", "Atornillador inalámbrico 12V", "herramientas", "Herramientas", "Makita", 49990, 15),
    product(
        "MC001",
        "Cemento Polpaico gris 25 kg",
        "materiales-construccion",
        "Materiales de construcción",
        "Polpaico",
        5990,
        80,
    ),
]

// Rutas del catálogo para mockApi
export const catalogRoutes = {
    "GET /productos": products,
    "GET /categorias": categories,
    "GET /marcas": brands,
}

export const users = {
    admin: { id: 1, nombre: "Administrador General", email: "admin@losmaestros.cl", rol: "admin" },
    vendedor: { id: 2, nombre: "Pedro Soto", email: "vendedor@losmaestros.cl", rol: "vendedor" },
    cliente: { id: 3, nombre: "Camila Rojas", email: "cliente@losmaestros.cl", rol: "cliente" },
}
