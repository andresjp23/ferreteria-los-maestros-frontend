import { Link } from "react-router"
import { ArrowRight } from "lucide-react"

// Enlace con estilo de botón principal y flecha a la derecha.
// Uso: <Button to="/productos">Ver productos</Button>
export default function Button({ to, children }) {
    return (
        <Link
            to={to}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
            {children}
            <ArrowRight className="size-5" />
        </Link>
    )
}
