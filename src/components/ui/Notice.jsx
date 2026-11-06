import { X } from "lucide-react"

const tones = {
    success: "border-green-200 bg-green-50 text-green-700 [&_button]:hover:text-green-900",
    error: "border-red-200 bg-red-50 text-red-700 [&_button]:hover:text-red-900",
}

// Aviso con botón para cerrarlo. El texto va como contenido: <Notice>Texto</Notice>
// tone: "success" (verde, por defecto) o "error" (rojo)
export default function Notice({ children, onClose, tone = "success" }) {
    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            className={`mt-6 flex items-start justify-between gap-4 rounded-xl border px-5 py-4 text-sm ${tones[tone]}`}
        >
            <p>{children}</p>

            <button type="button" onClick={onClose} aria-label="Cerrar aviso" className="shrink-0">
                <X className="size-4" />
            </button>
        </div>
    )
}
