
import { Menu, Search, Bell, User } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { roleLabels } from "../../utils/roles"

export default function SellerTopbar({ onMenuClick }) {
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 md:px-8">
            <button
                type="button"
                onClick={onMenuClick}
                aria-label="Abrir menú"
                className="text-secondary xl:hidden"
            >
                <Menu className="size-6" />
            </button>

            <div className="hidden max-w-xl flex-1 items-center gap-3 rounded-full bg-slate-100 px-4 py-3 md:flex">
                <Search className="size-5 shrink-0 text-slate-500" />
                <input
                    type="text"
                    placeholder="Buscar en el panel..."
                    aria-label="Buscar en el panel"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
            </div>

            <div className="ml-auto flex items-center gap-3 md:gap-5">
                <button
                    type="button"
                    aria-label="Notificaciones"
                    title="Notificaciones"
                    className="relative text-secondary"
                >
                    <Bell className="size-5" />
                    <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-secondary">
                        <User className="size-5" />
                    </span>

                    <div className="hidden leading-tight sm:block">
                        <p className="text-sm font-semibold text-secondary">
                            {user?.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                            {roleLabels[user?.rol] ?? "Vendedor"}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}
