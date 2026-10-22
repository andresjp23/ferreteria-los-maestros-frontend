import { Link, NavLink, useNavigate } from "react-router"
import { LayoutDashboard, Package, Users, LogOut, X } from "lucide-react"
import useAuth from "../../hooks/useAuth"
import Logo from "../../assets/brand/logo.webp"

// Secciones del panel. Para agregar o quitar una, se edita solo esta lista.
const links = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Productos", to: "/admin/productos", icon: Package },
    { label: "Usuarios", to: "/admin/usuarios", icon: Users },
]

// Clases de cada enlace: naranja si es la sección activa
const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
        isActive ? "bg-primary text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`

export default function AdminSidebar({ open, onClose }) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    // Cierra la sesión y vuelve a la tienda
    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <>
            {/* Fondo oscuro detrás del menú (solo móvil y tablet): al tocarlo se cierra */}
            {open && <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-30 bg-black/50 xl:hidden" />}

            {/* Menú: en móvil y tablet entra deslizando desde la izquierda (-translate-x-full lo esconde).
                Desde xl (xl:translate-x-0) siempre está visible. */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-secondary transition-transform duration-200 xl:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                    <Link to="/admin" onClick={onClose} className="flex items-center gap-3">
                        <img src={Logo} alt="" className="w-10 object-contain" />
                        <div className="text-sm font-extrabold uppercase leading-tight">
                            <p className="text-white">Ferretería</p>
                            <p className="text-primary">Los Maestros</p>
                        </div>
                    </Link>

                    {/* Cerrar: solo móvil y tablet */}
                    <button type="button" onClick={onClose} aria-label="Cerrar menú" className="text-white xl:hidden">
                        <X className="size-6" />
                    </button>
                </div>

                {/* Secciones */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {links.map(({ label, to, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} onClick={onClose} className={linkClass}>
                            <Icon className="size-5" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Cerrar sesión */}
                <div className="border-t border-white/10 p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="size-5" />
                        Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    )
}
