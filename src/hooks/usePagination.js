import { useState } from "react"

// Pagina una lista ya filtrada.
// resetKey: cuando cambia (por ejemplo, porque cambió un filtro) se vuelve a la página 1.
// Se guarda junto a la página la clave con la que se eligió: si la clave actual es otra,
// la página vale 1. Así no hace falta un useEffect para reiniciarla.
export default function usePagination(items, { pageSize, resetKey = "" }) {
    const [state, setState] = useState({ key: resetKey, page: 1 })

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
    const requestedPage = state.key === resetKey ? state.page : 1
    // Nunca pasa de la última página (por ejemplo, si la lista se achica)
    const page = Math.min(requestedPage, totalPages)

    const startIndex = (page - 1) * pageSize
    const pageItems = items.slice(startIndex, startIndex + pageSize)

    return {
        page,
        totalPages,
        pageItems,
        setPage: (nextPage) => setState({ key: resetKey, page: nextPage }),
        // Posiciones para el texto "Mostrando 1-8 de 42"
        start: items.length === 0 ? 0 : startIndex + 1,
        end: startIndex + pageItems.length,
        total: items.length,
    }
}
