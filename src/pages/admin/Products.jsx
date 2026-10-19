import { useState } from "react"
import { Plus, X } from "lucide-react"
import { products } from "../../mocks/products"
import { categories } from "../../mocks/categories"
import { getStockStatus } from "../../utils/stock"
import { normalizeText } from "../../utils/format"
import PageHeader from "../../components/admin/PageHeader"
import ProductFilters from "../../components/admin/products/ProductFilters"
import ProductsTable from "../../components/admin/products/ProductsTable"
import Pagination from "../../components/admin/Pagination"
import Modal from "../../components/admin/Modal"
import AddProductForm from "../../components/admin/products/AddProductForm"
import { buildProduct } from "../../utils/productValidation"

// Cuántos productos se muestran por página
const PAGE_SIZE = 8

export default function AdminProducts() {
    // Filtros ("" = sin filtro) y página actual
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [status, setStatus] = useState("")
    const [page, setPage] = useState(1)

    // Modal de "Agregar producto" y aviso de resultado
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [notice, setNotice] = useState("")

    // Se ejecuta cuando el formulario pasa TODAS las validaciones
    const handleAddProduct = (values) => {
        // Convierte los textos del formulario en el producto con sus tipos reales
        const newProduct = buildProduct(values)

        // Fase 2: aquí va la llamada al backend. Por ahora solo se muestra cómo quedaría el producto.
        console.log("Producto listo para enviar:", newProduct)

        setIsAddOpen(false)
        setNotice(`El producto "${newProduct.nombre}" pasó todas las validaciones.`)
    }

    // Cada vez que cambia un filtro se vuelve a la página 1
    const handleSearchChange = (value) => {
        setSearch(value)
        setPage(1)
    }
    const handleCategoryChange = (value) => {
        setCategory(value)
        setPage(1)
    }
    const handleStatusChange = (value) => {
        setStatus(value)
        setPage(1)
    }
    const handleClear = () => {
        setSearch("")
        setCategory("")
        setStatus("")
        setPage(1)
    }

    // Texto buscado, sin mayúsculas ni tildes
    const normalizedSearch = normalizeText(search.trim())

    // Productos que cumplen los tres filtros a la vez (cada filtro vacío deja pasar a todos)
    const filteredProducts = products.filter((product) => {
        const categoryName = categories.find((c) => c.id === product.categoria)?.nombre ?? ""

        // Texto donde se busca: nombre y categoría
        const text = normalizeText(`${product.nombre} ${categoryName}`)

        return (
            // Todas las palabras escritas tienen que aparecer en el texto
            (normalizedSearch === "" || normalizedSearch.split(" ").every((word) => text.includes(word))) &&
            (category === "" || product.categoria === category) &&
            (status === "" || getStockStatus(product.stock) === status)
        )
    })

    // Paginación
    const total = filteredProducts.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const startIndex = (page - 1) * PAGE_SIZE
    const pageProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE)

    // Texto "Mostrando 1-8 de 85 productos"
    const summary =
        total === 0
            ? "No hay productos"
            : `Mostrando ${startIndex + 1}-${startIndex + pageProducts.length} de ${total} productos`

    return (
        <>
            <title>Productos | Panel de administración | Ferretería Los Maestros</title>

            <PageHeader
                title="Productos"
                description="Gestiona el catálogo de productos de tu tienda."
                action={
                    <button
                        type="button"
                        onClick={() => setIsAddOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Plus className="size-5" />
                        Agregar producto
                    </button>
                }
            />

            {/* Aviso después de agregar */}
            {notice && (
                <div
                    role="status"
                    className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700"
                >
                    <p>{notice}</p>
                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        aria-label="Cerrar aviso"
                        className="shrink-0 hover:text-green-900"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}

            <ProductFilters
                search={search}
                onSearchChange={handleSearchChange}
                category={category}
                onCategoryChange={handleCategoryChange}
                status={status}
                onStatusChange={handleStatusChange}
                onClear={handleClear}
            />

            <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                {total === 0 ? (
                    // Ningún producto cumple los filtros
                    <div className="py-12 text-center">
                        <p className="font-semibold text-secondary">No encontramos productos</p>
                        <p className="mt-1 text-sm text-gray-500">Prueba con otra búsqueda o quita algún filtro.</p>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="mt-4 text-sm font-medium text-primary hover:opacity-80"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="mb-4 text-right text-xs text-gray-500">{summary}</p>

                        <ProductsTable products={pageProducts} />

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500">{summary}</p>
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    </>
                )}
            </section>
            
            <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Agregar producto">
                <AddProductForm onCancel={() => setIsAddOpen(false)} onSubmit={handleAddProduct} />
            </Modal>
        </>
    )
}