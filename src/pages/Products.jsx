import Banner from "../components/products/Banner"
import ProductCard from "../components/products/ProductCard"
import { products } from "../mocks/products"
import FiltersSidebar from "../components/products/FiltersSidebar"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { ChevronDown } from "lucide-react"


// Pasa a minúsculas y quita tildes y la ñ: "Cañería" -> "caneria"
const normalize = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export default function Products() {
    const [visibleCount, setVisibleCount] = useState(16) // estado para limiitar la cantidad de productos visibles
    // Estado para los filtros
    const [selectedCategories, setSelectedCategories] = useState([])
    // Estado para las marcas
    const [selectedBrands, setSelectedBrands] = useState([])
    // Estado para solo los productos que estan en stock
    const [onlyInStock, setOnlyInStock] = useState(false)
    // Estado para el precio (minimo y maximo)
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    // Estado para el orden
    const [sortBy, setSortBy] = useState("nombre-asc")
    // Búsqueda que viene de la URL (/productos?q=taladro)
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q") ?? ""

    // Cuando cambia la búsqueda, vuelve a mostrar los primeros 16
    useEffect(() => {
        setVisibleCount(16)
    }, [query])


    // Guarda el orden seleccionado y vuelve a mostrar los 16
    const handleSortChange = (value) => {
        setSortBy(value)
        setVisibleCount(16)
    }

    // Funciones para los inputs de precios
    const handleMinPriceChange = (value) => {
        setMinPrice(value)
        setVisibleCount(16)

    }
    const handleMaxPriceChange = (value) => {
        setMaxPrice(value)
        setVisibleCount(16)

    }


    // Funcion para invertir el valor del stock
    const handleStockChange = () => {
        setOnlyInStock(prev => !prev) // invierte el valor anterior
        setVisibleCount(16)
    }
    

    // Funcion para saber cuando se selecciona una marca
    const handleBrandChange = (brand) => {
        if (!selectedBrands.includes(brand)){
            setSelectedBrands([...selectedBrands, brand])
        }else{
            setSelectedBrands(selectedBrands.filter(b => b !== brand))
        }
        // cuando se cambie el filtro, vuelve a mostrar los 16
        setVisibleCount(16)
    }

    // Funcion para saber cuando se marca una categoria
    const handleCategoryChange = (id) => {
        if (!selectedCategories.includes(id)){
            setSelectedCategories([...selectedCategories, id])
        }
        else {
            setSelectedCategories(selectedCategories.filter(c => c !== id))
        }
        // cuando se cambie el filtro, vuelve a mostrar los 16
        setVisibleCount(16)
    }
    
    // Funcion para cargar 16 productos mas
    const handleShowMore = () => {
        setVisibleCount(prevCount => prevCount + 16)
    }

    const normalizedQuery = normalize(query.trim())

    // Lista de productos filtrados (si no hay ninguna categoria o marca marcada, pasan todos los productos)
    const filteredProducts = products.filter(product =>
            (selectedCategories.length === 0 || selectedCategories.includes(product.categoria)) &&
            (selectedBrands.length === 0 || selectedBrands.includes(product.marca)) &&
            (!onlyInStock || product.stock > 0) &&
            (minPrice === "" || product.precio >= Number(minPrice)) &&
            (maxPrice === "" || product.precio <= Number(maxPrice)) &&
            (normalizedQuery === "" || normalizedQuery.split(" ").every(word =>
            normalize(`${product.nombre} ${product.marca} ${product.subcategoria}`).includes(word)))

        )
    
    // Orden: copia de la lista filtrada, ordenada según la opción elegida
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "precio-asc") return a.precio - b.precio
        if (sortBy === "precio-desc") return b.precio - a.precio
        return a.nombre.localeCompare(b.nombre, "es") // nombre-asc
    })
    

    // ver que productos se tienen que mostrar
    const visibleProducts = sortedProducts.slice(0, visibleCount)

    return (
        <>
            <Banner />

            {/* Zona del catálogo */}
            <section className="px-6 py-8 md:px-10 md:py-10 xl:px-20 xl:py-12">
                
                {/* Contenedor principal Grid: 2 columnas en pantallas grandes (xl) */}
                <div className="xl:grid xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start xl:gap-8">
                    
                    {/* Columna Izquierda: Filtros */}
                    <FiltersSidebar
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}   
                        selectedBrands={selectedBrands}
                        onBrandChange={handleBrandChange}   
                        onlyInStock={onlyInStock}
                        onStockChange={handleStockChange}     
                        minPrice={minPrice}
                        onMinPriceChange={handleMinPriceChange}
                        maxPrice={maxPrice}
                        onMaxPriceChange={handleMaxPriceChange}         
                    />

                    {/* Columna Derecha: cabecera + grilla */}
                    <div>
                        {/* Fila: cantidad de productos + ordenar por */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-gray-600">
                                Mostrando {visibleProducts.length} productos
                            </span>

                            <div className="flex items-center gap-3">
                                <label htmlFor="ordenar" className="text-sm text-gray-600">
                                    Ordenar por:
                                </label>

                                <div className="relative">
                                    <select
                                        id="ordenar"
                                        value={sortBy}
                                        onChange={(event) => handleSortChange(event.target.value)}
                                        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-secondary outline-none transition"
                                    >
                                        <option value="nombre-asc">Nombre: A-Z</option>
                                        <option value="precio-asc">Precio: menor a mayor</option>
                                        <option value="precio-desc">Precio: mayor a menor</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* Grilla de productos */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {visibleProducts.map(product =>
                                <ProductCard
                                    key={product.id}
                                    image={product.image}
                                    nombre={product.nombre}
                                    precio={product.precio}
                                    unidad={product.unidad}
                                    stock={product.stock}
                                />
                            )}

                            {/* Boton mostrar mas */}
                            {visibleCount < filteredProducts.length && (
                                <div className="col-span-full flex justify-center pb-8">
                                    <button
                                        onClick={handleShowMore}
                                        className="px-8 py-3 bg-primary hover:opacity-90 text-white font-semibold rounded-md transition-colors"
                                    >
                                        Mostrar más
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}