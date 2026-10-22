import { ChevronLeft, ChevronRight } from "lucide-react"

// Cantidad máxima de botones con número que se muestran a la vez
const MAX_BUTTONS = 5

// Clases comunes a todos los botones
const buttonBase = "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition"

export default function Pagination({ page, totalPages, onPageChange }) {
    // Primer número a mostrar: deja la página actual al centro de la ventana,
    // sin pasarse del inicio (1) ni del final (totalPages)
    const first = Math.max(1, Math.min(page - 2, totalPages - MAX_BUTTONS + 1))
    const last = Math.min(totalPages, first + MAX_BUTTONS - 1)

    // Arma el arreglo de números a mostrar: [first, first+1, ..., last]
    const pages = Array.from({ length: last - first + 1 }, (_, index) => first + index)

    return (
        <nav aria-label="Paginación" className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Página anterior"
                className={`${buttonBase} border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
            >
                <ChevronLeft className="size-4" />
            </button>

            {pages.map((number) => (
                <button
                    key={number}
                    type="button"
                    onClick={() => onPageChange(number)}
                    // Avisa a los lectores de pantalla cuál es la página actual
                    aria-current={number === page ? "page" : undefined}
                    className={`${buttonBase} ${
                        number === page
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    {number}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Página siguiente"
                className={`${buttonBase} border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
            >
                <ChevronRight className="size-4" />
            </button>
        </nav>
    )
}
