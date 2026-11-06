import { AlertTriangle } from "lucide-react"

// Error al cargar datos del backend, con botón opcional para reintentar
export default function ErrorMessage({ children, onRetry }) {
    return (
        <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700"
        >
            <AlertTriangle className="size-8" />
            <p>{children}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-lg border border-red-300 px-4 py-2 font-semibold transition hover:bg-red-100"
                >
                    Reintentar
                </button>
            )}
        </div>
    )
}
