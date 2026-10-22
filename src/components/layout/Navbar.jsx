import { useEffect, useState } from "react"
import NavSearchBar from "../ui/NavSearchBar"
import Logo from "../../assets/brand/logo.webp"
import { LogOut, Menu, User, ShoppingCart, X } from "lucide-react"
import { Link, NavLink } from "react-router"
import useCart from "../../hooks/useCart"
import useAuth from "../../hooks/useAuth"

// Clases de los enlaces de escritorio: subrayado naranja si la ruta está activa
const desktopLinkClass = ({ isActive }) =>
    `border-b-2 py-1 text-white transition-colors hover:text-primary ${
        isActive ? "border-primary" : "border-transparent"
    }`

// Clases de los enlaces del menú móvil (self-start: el subrayado solo cubre el texto)
const mobileLinkClass = ({ isActive }) =>
    `self-start my-2 border-b-2 py-1 text-lg text-white transition-colors hover:text-primary ${
        isActive ? "border-primary" : "border-transparent"
    }`

const navLinks = [
    { label: "Inicio", to: "/" },
    { label: "Productos", to: "/productos" },
    { label: "Nosotros", to: "/nosotros" },
    { label: "Contacto", to: "/contacto" },
]

export default function Navbar() {
    // Estado para abrir/cerrar el menú en móviles
    const [isOpen, setIsOpen] = useState(false)
    // carrito desde el contexto
    const { totalUnits } = useCart()
    const { user, logout } = useAuth()
    const isClient = user?.rol === "cliente"

    const handleLogout = () => {
        logout()
        setIsOpen(false)
    }

    // Con el menú abierto, la tecla Esc lo cierra
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setIsOpen(false)
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen])

    return (
        // Header fijo arriba al hacer scroll (desktop y móvil)
        <header className="sticky top-0 z-50">
            {/* --- CONTENEDOR PRINCIPAL DEL NAVBAR --- */}
            <div className="relative z-10 bg-secondary flex justify-between md:grid md:grid-cols-[auto_1fr_auto] items-center px-6 md:px-12 py-4 select-none border-b">
                {/* --- SECCIÓN IZQUIERDA: LOGO Y LINKS --- */}
                <div className="flex items-center gap-8 xl:gap-12">
                    <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
                        <img src={Logo} alt="" className="w-16 h-auto object-contain" />
                        <div className="font-bold text-xl leading-none flex flex-col">
                            <span className="text-white">FERRETERÍA</span>
                            <span className="text-primary">LOS MAESTROS</span>
                        </div>
                    </Link>

                    {/* Enlaces de navegación (escritorio) */}
                    <nav className="hidden md:flex gap-6 items-center">
                        {navLinks.map(({ label, to }) => (
                            <NavLink key={label} to={to} end={to === "/"} className={desktopLinkClass}>
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* --- SECCIÓN CENTRAL: BARRA DE BÚSQUEDA --- */}
                <div className="hidden md:block w-full max-w-xs xl:max-w-md mx-auto px-4">
                    <NavSearchBar />
                </div>

                {/* --- SECCIÓN DERECHA: ACCIONES --- */}
                <div className="hidden md:flex items-center gap-6 justify-end">
                    {isClient ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-white transition-colors hover:text-primary"
                        >
                            <LogOut className="size-6" />
                            Cerrar sesión
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex gap-2 items-center text-white hover:text-primary transition-colors"
                        >
                            <User className="size-6" />
                            Iniciar Sesión
                        </Link>
                    )}
                    <Link
                        to="/carrito"
                        aria-label={`Carrito (${totalUnits})`}
                        className="relative text-white hover:text-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
                            <path
                                fill="currentColor"
                                d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607L1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4a2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4a2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2a1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2"
                            />
                        </svg>
                        {/* Contador: círculo naranja con el número en blanco, sobre la esquina superior derecha del ícono */}
                        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                            {/* Si hay más de 99 unidades, muestra "99+" para que no se agrande */}
                            {totalUnits > 99 ? "99+" : totalUnits}
                        </span>
                    </Link>
                </div>

                {/* --- BOTÓN HAMBURGUESA (Móvil) --- */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                    className="md:hidden rounded-md p-2 text-white focus-visible:outline-2 focus-visible:outline-primary"
                >
                    {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* --- MENÚ MÓVIL --- */}
            {isOpen && (
                <>
                    {/* Fondo oscurecido: al tocarlo se cierra el menú */}
                    <div
                        aria-hidden="true"
                        onClick={() => setIsOpen(false)}
                        className="md:hidden fixed inset-0 z-0 bg-black/50"
                    />

                    {/* Panel flotante debajo de la barra */}
                    <div
                        id="mobile-menu"
                        className="md:hidden absolute left-0 right-0 top-full z-10 bg-secondary border-b px-6 pb-6 pt-2 shadow-lg"
                    >
                        {/* Enlaces */}
                        <nav className="flex flex-col">
                            {navLinks.map(({ label, to }) => (
                                <NavLink
                                    key={label}
                                    to={to}
                                    end={to === "/"}
                                    onClick={() => setIsOpen(false)}
                                    className={mobileLinkClass}
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Botones */}
                        <div className="mt-6 flex flex-col gap-3">
                            {/* Principal: carrito */}
                            <Link
                                to="/carrito"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:opacity-90 transition"
                            >
                                <ShoppingCart className="size-5" />
                                Carrito ({totalUnits})
                            </Link>

                            {/* Secundario: iniciar sesión (outline) */}
                            {isClient ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
                                >
                                    <LogOut className="size-5" />
                                    Cerrar sesión
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-white transition"
                                >
                                    <User className="size-5" />
                                    Iniciar sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    )
}
