import { useCallback, useEffect, useMemo, useState } from "react"
import * as catalogService from "../services/catalogService"
import { CatalogContext } from "./catalogContext"

// Pide el catálogo al backend UNA vez al abrir la app y lo comparte con todas las páginas
// (catálogo, detalle, inicio y carrito). Así no se repite la misma petición en cada vista.
// Los filtros, la búsqueda y el orden se siguen aplicando en el navegador sobre esta lista.
export function CatalogProvider({ children }) {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Pide productos, categorías, marcas y unidades en paralelo (Promise.all espera a todas).
    // El estado se actualiza recién cuando llegan las respuestas.
    const reload = useCallback(
        () =>
            Promise.all([
                catalogService.getProducts(),
                catalogService.getCategories(),
                catalogService.getBrands(),
                catalogService.getUnits(),
            ])
                .then(([productList, categoryList, brandList, unitList]) => {
                    setProducts(productList)
                    setCategories(categoryList)
                    setBrands(brandList)
                    setUnits(unitList)
                    setError("")
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false)),
        [],
    )

    // Primera carga, al abrir la app
    useEffect(() => {
        reload()
    }, [reload])

    // Botón "Reintentar" después de un error: muestra el aviso de carga mientras vuelve a pedir
    const retry = () => {
        setError("")
        setLoading(true)
        reload()
    }

    // Índices por id: buscar en un Map es directo, en vez de recorrer el arreglo en cada render.
    // useMemo los vuelve a crear solo cuando cambia la lista.
    const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
    const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.nombre])), [categories])

    const value = {
        products,
        categories,
        brands,
        units,
        loading,
        error,
        reload, // vuelve a pedir el catálogo sin mostrar "Cargando" (ej. después de una compra)
        retry,
        getProductById: (id) => productsById.get(id),
        // Nombre visible de una categoría: "materiales-construccion" -> "Materiales de construcción"
        getCategoryName: (id) => categoryNames.get(id) ?? id,
    }

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
