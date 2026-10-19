import { X } from "lucide-react"

// Aviso verde con botón para cerrarlo. El texto va como contenido: <Notice>Texto</Notice>
export default function Notice({ children, onClose }) {
    return (
        <div
            role="status"
            className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700"
        >
            <p>{children}</p>

            <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar aviso"
                className="shrink-0 hover:text-green-900"
            >
                <X className="size-4" />
            </button>
        </div>
    )
}