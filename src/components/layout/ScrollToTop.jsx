import { useEffect } from "react"
import { useLocation } from "react-router"

// En una SPA el navegador no vuelve arriba al cambiar de página.
// Este componente lo hace cada vez que cambia la ruta (no cuando solo cambian los filtros de la URL).
export default function ScrollToTop() {
    const { pathname } = useLocation()

    // pathname no se usa dentro del efecto, pero es justamente lo que debe dispararlo
    // oxlint-disable-next-line react/exhaustive-deps
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
