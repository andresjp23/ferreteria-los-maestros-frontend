import { MapPin, Phone, Mail, Clock } from "lucide-react"

const quickLinks = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
]

const categories = [
    { label: "Materiales de construcción", href: "/productos" },
    { label: "Herramientas", href: "/productos" },
    { label: "Gasfitería y electricidad", href: "/productos" },
]

const contactInfo = [
    { icon: MapPin, text: "Dirección de la tienda, La Serena" },
    { icon: Phone, text: "+56 9 1234 5678" },
    { icon: Mail, text: "contacto@losmaestros.cl" },
    { icon: Clock, text: "Lun a Sáb: 9:00 - 19:00" },
]

export default function Footer() {
    return (
        <footer className="bg-secondary text-white">
            <div className="grid gap-10 px-6 py-12 md:grid-cols-2 md:px-10 md:py-14 xl:grid-cols-4 xl:px-20">
                {/* Marca */}
                <div className="flex flex-col gap-4">
                    <a href="/" className="text-xl font-extrabold leading-tight">
                        <span className="block text-white">FERRETERÍA</span>
                        <span className="block text-primary">LOS MAESTROS</span>
                    </a>
                    <p className="max-w-xs text-sm text-white/70">
                        Materiales de construcción, herramientas y ferretería general para tus proyectos, grandes o pequeños.
                    </p>
                </div>

                {/* Enlaces */}
                <div className="flex flex-col gap-4">
                    <h3 className="flex items-center gap-3 font-semibold">
                        <span className="h-1 w-4 rounded-full bg-primary" />
                        Enlaces
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-white/70">
                        {quickLinks.map(({ label, href }) => (
                            <li key={label}>
                                <a href={href} className="transition hover:text-primary">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Categorías */}
                <div className="flex flex-col gap-4">
                    <h3 className="flex items-center gap-3 font-semibold">
                        <span className="h-1 w-4 rounded-full bg-primary" />
                        Categorías
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-white/70">
                        {categories.map(({ label, href }) => (
                            <li key={label}>
                                <a href={href} className="transition hover:text-primary">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contacto */}
                <div className="flex flex-col gap-4">
                    <h3 className="flex items-center gap-3 font-semibold">
                        <span className="h-1 w-4 rounded-full bg-primary" />
                        Contacto
                    </h3>
                    <ul className="flex flex-col gap-3 text-sm text-white/70">
                        {contactInfo.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Barra inferior */}
            <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/60 md:px-10 xl:px-20">
                © {new Date().getFullYear()} Ferretería Los Maestros. Todos los derechos reservados.
            </div>
        </footer>
    )
}