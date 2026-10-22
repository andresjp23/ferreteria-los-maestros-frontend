import { useState } from "react"
import { useSearchParams } from "react-router"
import { ChevronDown } from "lucide-react"
import Banner from "../components/products/Banner"
import ProductCard from "../components/products/ProductCard"
import FiltersSidebar from "../components/products/FiltersSidebar"
import NavSearchBar from "../components/ui/NavSearchBar"
import useCart from "../hooks/useCart"
import { products } from "../mocks/products"
import { matchesAllWords } from "../utils/format"

// Cuántos productos se muestran al inicio y cuántos más con cada "Mostrar más"
const PAGE_SIZE = 16
const DEFAULT_SORT = "nombre-asc"

export default function Products() {
    // Todos los filtros viven en la URL, por ejemplo:
    // /productos?q=taladro&categoria=herramientas&marca=Makita&stock=1&min=1000&max=50000&orden=precio-asc
    // Así se pueden compartir con un link, sobreviven a una recarga y funcionan con atrás/adelante.
    const [searchParams, setSearchParams] = useSearchParams()

    const query = searchParams.get("q") ?? ""
    const selectedCategories = searchParams.getAll("categoria")
    const selectedBrands = searchParams.getAll("marca")
    const onlyInStock = searchParams.get("stock") === "1"
    const minPrice = searchParams.get("min") ?? ""
    const maxPrice = searchParams.get("max") ?? ""
    const sortBy = searchParams.get("orden") ?? DEFAULT_SORT

    // "Mostrar más": se guarda junto a los filtros con que se pidió.
    // Si los filtros cambian, la clave ya no coincide y se vuelve a mostrar solo la primera tanda.
    const filtersKey = searchParams.toString()
    const [showMore, setShowMore] = useState({ key: filtersKey, count: PAGE_SIZE })
    const visibleCount = showMore.key === filtersKey ? showMore.count : PAGE_SIZE

    // Trae del contexto la función para agregar al carrito
    const { addToCart } = useCart()

    // Copia los parámetros actuales, aplica el cambio y reemplaza la URL
    // (replace: cambiar un filtro no agrega una entrada al historial por cada clic)
    const updateParams = (change) => {
        const next = new URLSearchParams(searchParams)
        change(next)
        setSearchParams(next, { replace: true })
    }

    // Para filtros de un solo valor: lo guarda, o lo quita si viene vacío
    const setParam = (key, value) => updateParams((next) => (value ? next.set(key, value) : next.delete(key)))

    // Para filtros con varios valores (categorías, marcas): marca o desmarca uno
    const toggleParam = (key, value) =>
        updateParams((next) => {
            const values = next.getAll(key)
            const updated = values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
            next.delete(key)
            updated.forEach((v) => next.append(key, v))
        })

    // Limpia los filtros pero conserva la búsqueda
    const handleClearFilters = () =>
        updateParams((next) => {
            for (const key of ["categoria", "marca", "stock", "min", "max", "orden"]) next.delete(key)
        })

    // Lista de productos filtrados (si no hay ninguna categoria o marca marcada, pasan todos los productos)
    const filteredProducts = products.filter(
        (product) =>
            (selectedCategories.length === 0 || selectedCategories.includes(product.categoria)) &&
            (selectedBrands.length === 0 || selectedBrands.includes(product.marca)) &&
            (!onlyInStock || product.stock > 0) &&
            (minPrice === "" || product.precio >= Number(minPrice)) &&
            (maxPrice === "" || product.precio <= Number(maxPrice)) &&
            matchesAllWords(`${product.nombre} ${product.marca} ${product.subcategoria}`, query),
    )

    // Orden: copia de la lista filtrada, ordenada según la opción elegida
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "precio-asc") return a.precio - b.precio
        if (sortBy === "precio-desc") return b.precio - a.precio
        return a.nombre.localeCompare(b.nombre, "es") // nombre-asc
    })

    // ver que productos se tienen que mostrar
    const visibleProducts = sortedProducts.slice(0, visibleCount)
    const total = sortedProducts.length

    return (
        <>
            <title>Productos | Ferretería Los Maestros</title>
            <Banner />

            {/* Zona del catálogo */}
            <section className="px-6 py-8 md:px-10 md:py-10 xl:px-20 xl:py-12">
                {/* Contenedor principal Grid: 2 columnas en pantallas grandes (xl) */}
                <div className="xl:grid xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start xl:gap-8">
                    <div className="mb-4 md:hidden">
                        <NavSearchBar variant="catalog" />
                    </div>

                    {/* Columna Izquierda: Filtros */}
                    <FiltersSidebar
                        selectedCategories={selectedCategories}
                        onCategoryChange={(id) => toggleParam("categoria", id)}
                        selectedBrands={selectedBrands}
                        onBrandChange={(brand) => toggleParam("marca", brand)}
                        onlyInStock={onlyInStock}
                        onStockChange={() => setParam("stock", onlyInStock ? "" : "1")}
                        minPrice={minPrice}
                        onMinPriceChange={(value) => setParam("min", value)}
                        maxPrice={maxPrice}
                        onMaxPriceChange={(value) => setParam("max", value)}
                        onClear={handleClearFilters}
                    />

                    {/* Columna Derecha: cabecera + grilla */}
                    <div>
                        {/* Fila: cantidad de productos + ordenar por */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-gray-600" aria-live="polite">
                                Mostrando {visibleProducts.length} de {total} {total === 1 ? "producto" : "productos"}
                            </span>

                            <div className="flex items-center gap-3">
                                <label htmlFor="ordenar" className="text-sm text-gray-600">
                                    Ordenar por:
                                </label>

                                <div className="relative">
                                    <select
                                        id="ordenar"
                                        value={sortBy}
                                        onChange={(event) =>
                                            setParam(
                                                "orden",
                                                event.target.value === DEFAULT_SORT ? "" : event.target.value,
                                            )
                                        }
                                        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-secondary outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                                    >
                                        <option value="nombre-asc">Nombre: A-Z</option>
                                        <option value="precio-asc">Precio: menor a mayor</option>
                                        <option value="precio-desc">Precio: mayor a menor</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {total === 0 ? (
                            // Ningún producto cumple los filtros
                            <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
                                <p className="font-semibold text-secondary">No encontramos productos</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Prueba con otra búsqueda o quita algún filtro.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="mt-4 text-sm font-medium text-primary hover:opacity-80"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        ) : (
                            /* Grilla de productos */
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {visibleProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={() => addToCart(product)}
                                    />
                                ))}

                                {/* Boton mostrar mas */}
                                {visibleCount < total && (
                                    <div className="col-span-full flex justify-center pb-8">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowMore({ key: filtersKey, count: visibleCount + PAGE_SIZE })
                                            }
                                            className="rounded-md bg-primary px-8 py-3 font-semibold text-white transition-colors hover:opacity-90"
                                        >
                                            Mostrar más
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
