import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import SectionTitle from "./SectionTitle"

export default function Modal({ open, onClose, title, children }) {
    const dialogRef = useRef(null)

    // Abre o cierra el <dialog> nativo según la prop "open"
    useEffect(() => {
        const dialog = dialogRef.current

        if (open) {
            // showModal: lo muestra al centro, con fondo oscuro y bloqueando el resto de la página
            dialog.showModal()
            // Evita que la página de atrás se desplace mientras el modal está abierto
            document.body.style.overflow = "hidden"
            // Lleva el foco al elemento marcado con data-autofocus (el primer campo)
            dialog.querySelector("[data-autofocus]")?.focus()
        }

        // Se ejecuta al cerrarse o al desmontarse: cierra el <dialog> y devuelve el scroll
        return () => {
            if (dialog.open) dialog.close()
            document.body.style.overflow = ""
        }
    }, [open])

    return (
        <dialog
            ref={dialogRef}
            aria-label={title}
            // onClose se dispara cuando el navegador lo cierra (por ejemplo con la tecla Esc)
            onClose={onClose}
            // Un clic en el fondo oscuro cuenta como clic sobre el propio <dialog>
            // (el contenido de adentro ocupa todo el cuadro, así que no se confunde)
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
            // m-auto: Tailwind quita el margen del <dialog>, y sin él quedaría pegado arriba a la izquierda
            className="m-auto w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl bg-white p-0 text-slate-800 shadow-xl backdrop:bg-black/50"
        >
            {/* El contenido solo existe mientras está abierto: al cerrar se destruye
                y el formulario siempre vuelve a abrirse vacío */}
            {open && (
                <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
                    <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 md:px-6">
                        <SectionTitle>{title}</SectionTitle>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="text-gray-500 transition-colors hover:text-secondary"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {children}
                </div>
            )}
        </dialog>
    )
}