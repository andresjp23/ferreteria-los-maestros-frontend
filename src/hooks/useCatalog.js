import { useContext } from "react"
import { CatalogContext } from "../context/catalogContext"

// Hook propio: atajo para acceder al catálogo desde cualquier componente
// Uso:  const { products, loading, error } = useCatalog()
export default function useCatalog() {
    const context = useContext(CatalogContext)

    if (!context) throw new Error("useCatalog debe usarse dentro de <CatalogProvider>")

    return context
}
