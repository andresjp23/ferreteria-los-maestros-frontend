import { useState } from "react"
import { Plus } from "lucide-react"
import { products } from "../../mocks/products"
import { getStockStatus } from "../../utils/stock"
import { matchesAllWords } from "../../utils/format"
import { getCategoryName } from "../../utils/catalog"
import { buildProduct } from "../../utils/productValidation"
import usePagination from "../../hooks/usePagination"
import PageHeader from "../../components/admin/PageHeader"
import ProductFilters from "../../components/admin/products/ProductFilters"
import ProductsTable from "../../components/admin/products/ProductsTable"
import AddProductForm from "../../components/admin/products/AddProductForm"
import Pagination from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import Notice from "../../components/ui/Notice"

// Cuántos productos se muestran por página
const PAGE_SIZE = 8

export default function AdminProducts() {
    // Filtros ("" = sin filtro)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [status, setStatus] = useState("")

    // Modal de "Agregar producto" y aviso de resultado
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [notice, setNotice] = useState("")

    // Se ejecuta cuando el formulario pasa TODAS las validaciones
    const handleAddProduct = (values) => {
        // Convierte los textos del formulario en el producto con sus tipos reales.
        // Fase 2: aquí va la llamada al backend (POST /productos) con newProduct.
        const newProduct = buildProduct(values)

        setIsAddOpen(false)
        setNotice(
            `El producto "${newProduct.nombre}" pasó todas las validaciones. Por ahora no se guarda: eso llega con el backend.`,
        )
    }

    const handleClear = () => {
        setSearch("")
        setCategory("")
        setStatus("")
    }

    // Productos que cumplen los tres filtros a la vez (cada filtro vacío deja pasar a todos).
    // En la búsqueda, todas las palabras escritas tienen que aparecer en el nombre o la categoría.
    const filteredProducts = products.filter(
        (product) =>
            matchesAllWords(`${product.nombre} ${getCategoryName(product.categoria)}`, search) &&
            (category === "" || product.categoria === category) &&
            (status === "" || getStockStatus(product.stock) === status),
    )

    // Paginación: si cambia algún filtro, vuelve a la página 1
    const { page, totalPages, pageItems, setPage, start, end, total } = usePagination(filteredProducts, {
        pageSize: PAGE_SIZE,
        resetKey: `${search}|${category}|${status}`,
    })

    // Texto "Mostrando 1-8 de 85 productos"
    const summary = total === 0 ? "No hay productos" : `Mostrando ${start}-${end} de ${total} productos`

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
            {notice && <Notice onClose={() => setNotice("")}>{notice}</Notice>}

            <ProductFilters
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                status={status}
                onStatusChange={setStatus}
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
                        <ProductsTable products={pageItems} />

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
