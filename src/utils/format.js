

// Precio en peso chilenos CLP
export const formatPrice = (value) =>
    new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(value)

// Pasa a minúsculas y quita tildes y la ñ: "Cañería" -> "caneria"
export const normalizeText = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

// "2026-10-17T16:32" -> "17 oct 2026, 16:32".
// Si no hay fecha (el usuario nunca ha entrado) devuelve "Nunca".
export const formatDateTime = (iso) => {
    if (!iso) return "Nunca"

    return new Intl.DateTimeFormat("es-CL", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(iso))
}

// Iniciales para el avatar: "María González" -> "MG", "Administrador" -> "A"
export const getInitials = (name) =>
    name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase()