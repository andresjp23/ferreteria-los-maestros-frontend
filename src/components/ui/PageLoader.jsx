// Aviso de carga para una página completa (por ejemplo, mientras se valida la sesión o llega el catálogo)
export default function PageLoader({ text = "Cargando..." }) {
    return (
        <p role="status" className="p-10 text-center text-sm text-gray-500">
            {text}
        </p>
    )
}
