import { Link, NavLink, useNavigate } from "react-router"
import { LayoutDashboard, Package, ShoppingCart, Users, ChartNoAxesColumn, Settings, LogOut, X } from "lucide-react"
import useAuth from "../../hooks/useAuth"
import Logo from "../../assets/brand/logo.webp"

const links = [
    { label: "Dashboard", icon: LayoutDashboard, disabled: true },
    { label: "Productos", icon: Package, disabled: true },
    { label: "Pedidos", to: "/vendedor", icon: ShoppingCart, end: true },
    { label: "Clientes", icon: Users, disabled: true },
    { label: "Reportes", icon: ChartNoAxesColumn, disabled: true },
    { label: "Configuración", icon: Settings, disabled: true },
]

export default function SellerSidebar({ open, onClose }) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            isActive ? "bg-primary text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
        }`

    return (
        <>
            {open && <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-30 bg-black/50 xl:hidden" />}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-secondary transition-transform duration-200 xl:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                    <Link to="/vendedor" onClick={onClose} className="flex items-center gap-3">
                        <img src={Logo} alt="" className="w-10 object-contain" />
                        <div className="text-sm font-extrabold uppercase leading-tight">
                            <p className="text-white">Ferretería</p>
                            <p className="text-primary">Los Maestros</p>
                        </div>
                    </Link>

                    <button type="button" onClick={onClose} aria-label="Cerrar menú" className="text-white xl:hidden">
                        <X className="size-6" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {links.map(({ label, to, icon: Icon, end, disabled }) =>
                        disabled ? (
                            <div
                                key={label}
                                aria-disabled="true"
                                title="Sección pendiente de implementar"
                                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/40"
                            >
                                <Icon className="size-5" />
                                {label}
                            </div>
                        ) : (
                            <NavLink key={to} to={to} end={end} onClick={onClose} className={linkClass}>
                                <Icon className="size-5" />
                                {label}
                            </NavLink>
                        ),
                    )}
                </nav>

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
