import { Menu, User } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { roleLabels } from "../../utils/roles"

export default function AdminTopbar({ onMenuClick }) {
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 md:px-10">
            {/* Abrir el menú: solo móvil y tablet */}
            <button
                type="button"
                onClick={onMenuClick}
                aria-label="Abrir menú"
                className="text-secondary xl:hidden"
            >
                <Menu className="size-6" />
            </button>

            {/* Usuario (ml-auto lo empuja a la derecha) */}
            <div className="ml-auto flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-secondary">
                    <User className="size-5" />
                </span>
                <div className="leading-tight">
                    <p className="text-sm font-semibold text-secondary">{user.nombre}</p>
                    <p className="text-xs text-gray-500">{roleLabels[user.rol]}</p>
                </div>
            </div>
        </header>
    )
}