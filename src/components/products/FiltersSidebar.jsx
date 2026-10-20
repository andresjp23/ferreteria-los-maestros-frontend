import { useState } from "react"
import { SlidersHorizontal, ChevronDown, RefreshCw } from "lucide-react"
import { categories } from "../../mocks/categories"
import { brands } from "../../mocks/brands"

// Grupo colapsable: título + flecha + contenido
function FilterGroup({ title, defaultOpen = false, children }) {
    return (
        <details
            open={defaultOpen}
            className="group border-b border-gray-200 py-4 last:border-b-0"
        >
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-secondary [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
            </summary>

            <div className="mt-3">{children}</div>
        </details>
    )
}

export default function FiltersSidebar({
    selectedCategories, onCategoryChange,
    selectedBrands, onBrandChange,
    onlyInStock, onStockChange,
    minPrice, onMinPriceChange,
    maxPrice, onMaxPriceChange,
    onClear
    }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <aside className="mb-6 xl:mb-0 xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
            <button
                type="button"
                aria-expanded={isOpen}
                aria-controls="product-filters"
                onClick={() => setIsOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm xl:hidden"
            >
                <span className="flex items-center gap-3 text-lg font-bold text-secondary">
                    <SlidersHorizontal className="size-5 text-primary" />
                    Filtros
                </span>
                <ChevronDown className={`size-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <div
                id="product-filters"
                className={`${isOpen ? "block" : "hidden"} mt-3 rounded-xl border border-gray-200 bg-white shadow-sm xl:mt-0 xl:block`}
            >
            {/* Encabezado */}
            <div className="hidden items-center gap-3 border-b border-gray-200 px-5 py-4 xl:flex">
                <SlidersHorizontal className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-secondary">Filtros</h2>
            </div>

            <div className="px-5">
                {/* Categorías */}
                <FilterGroup title="Categorías">
                    <div className="flex flex-col gap-2">
                        {/* Aquí irá tu map. Ejemplo de una opción: */}
                        {categories.map(categorie => 
                            <label 
                                key={categorie.id}
                                className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    className="size-4 accent-primary"
                                    checked={selectedCategories.includes(categorie.id)}
                                    onChange={() => onCategoryChange(categorie.id)} 
                                />
                                {categorie.nombre}
                             </label>
                        )}
                    </div>
                </FilterGroup>

                {/* Precio */}
                <FilterGroup title="Precio">
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 focus-within:border-primary">
                            $
                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(event) => onMinPriceChange(event.target.value)}
                                placeholder="Mín."
                                className="w-full min-w-0 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                            />
                        </label>
                        <label className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 focus-within:border-primary">
                            $
                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(event => onMaxPriceChange(event.target.value))}
                                placeholder="Máx."
                                className="w-full min-w-0 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                            />
                        </label>
                    </div>


                </FilterGroup>

                {/* Marca: lista con scroll porque hay 31 marcas */}
                <FilterGroup title="Marca">
                    <div className="flex flex-col gap-2">
                        {/* Aquí irá tu map. Ejemplo de una opción: */}
                        {brands.map(brand => 
                            <label 
                                key={brand}
                                className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                                <input 
                                    type="checkbox" 
                                    className="size-4 accent-primary" 
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => onBrandChange(brand)}  />
                                {brand}
                             </label>
                        )}
                    </div>
                </FilterGroup>

                {/* Disponibilidad */}
                <FilterGroup title="Disponibilidad">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                        <input 
                            type="checkbox"
                            checked={onlyInStock}
                            className="size-4 accent-primary"
                            onChange={() => onStockChange()} 
                        />
                        En stock
                    </label>
                </FilterGroup>
            </div>

            {/* Limpiar filtros */}
            <div className="px-5 pb-5 pt-2">
                <button
                    type="button"
                    onClick={onClear}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                    <RefreshCw className="size-4" />
                    Limpiar filtros
                </button>
            </div>
            </div>
        </aside>
    )
}
