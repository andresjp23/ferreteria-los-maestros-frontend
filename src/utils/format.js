// Se crean una sola vez y se reutilizan: crear un Intl.NumberFormat en cada render es costoso
const priceFormatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
})

const dateTimeFormatter = new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
})

// Precio en pesos chilenos: 5990 -> "$5.990"
export const formatPrice = (value) => priceFormatter.format(value)

// Texto de la unidad de venta junto al precio: "Unidad" -> "c/u", "Saco" -> "/ saco"
export const formatUnit = (unit) => (unit === "Unidad" ? "c/u" : `/ ${unit.charAt(0).toLowerCase()}${unit.slice(1)}`)

// Pasa a minúsculas y quita tildes y la ñ: "Cañería" -> "caneria"
export const normalizeText = (text) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")

// true si TODAS las palabras buscadas aparecen en el texto (sin importar mayúsculas ni tildes).
// Una búsqueda vacía deja pasar todo.
export const matchesAllWords = (text, query) => {
    const words = normalizeText(query).split(/\s+/).filter(Boolean)
    const normalized = normalizeText(text)
    return words.every((word) => normalized.includes(word))
}

// "2026-10-17T16:32" -> "17 oct 2026, 16:32".
// Si no hay fecha (el usuario nunca ha entrado) devuelve "Nunca".
export const formatDateTime = (iso) => (iso ? dateTimeFormatter.format(new Date(iso)) : "Nunca")

// Iniciales para el avatar: "María González" -> "MG", "Administrador" -> "A"
export const getInitials = (name) =>
    name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
