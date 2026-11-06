import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { matchesAllWords } from "../../utils/format"
import { buildProduct, emptyProduct, productToForm } from "../../utils/productValidation"
import { createProduct, deleteProduct, getAdminProducts, updateProduct } from "../../services/adminService"
import useCatalog from "../../hooks/useCatalog"
import usePagination from "../../hooks/usePagination"
import PageHeader from "../../components/admin/PageHeader"
import ProductFilters from "../../components/admin/products/ProductFilters"
import ProductsTable from "../../components/admin/products/ProductsTable"
import ProductForm from "../../components/admin/products/ProductForm"
import Pagination from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import Notice from "../../components/ui/Notice"
import PageLoader from "../../components/ui/PageLoader"
import ErrorMessage from "../../components/ui/ErrorMessage"

// Cuántos productos se muestran por página
const PAGE_SIZE = 8

export default function AdminProducts() {
    // Productos del backend (GET /api/admin/productos, incluye el precio de compra)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState("")

    // Al cambiar el catálogo, la tienda pública también se actualiza
    const { reload: reloadCatalog } = useCatalog()

    // Filtros ("" = sin filtro)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [status, setStatus] = useState("")

    // editor: null = modal cerrado; { product: null } = agregar; { product } = editar ese producto
    const [editor, setEditor] = useState(null)

    // Aviso de resultado: { tone: "success" | "error", text }
    const [notice, setNotice] = useState(null)

    const loadProducts = useCallback(
        () =>
            getAdminProducts()
                .then((list) => {
                    setProducts(list)
                    setLoadError("")
                })
                .catch((error) => setLoadError(error.message))
                .finally(() => setLoading(false)),
        [],
    )

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    // Después de un cambio: refresca la tabla y el catálogo público
    const refresh = () => {
        loadProducts()
        reloadCatalog()
    }

    // Lo llama el formulario cuando pasa sus validaciones. Si el backend rechaza los datos,
    // devuelve { mensaje, campos } para que el formulario muestre cada error en su campo.
    const handleSave = async (values) => {
        const editing = editor.product !== null
        try {
            const saved = editing
                ? await updateProduct(editor.product.id, buildProduct(values))
                : await createProduct(buildProduct(values))

            setEditor(null)
            setNotice({
                tone: "success",
                text: editing
                    ? `Se guardaron los cambios de "${saved.nombre}".`
                    : `El producto "${saved.nombre}" se agregó al catálogo.`,
            })
            refresh()
        } catch (error) {
            return { mensaje: error.message, campos: error.campos }
        }
    }

    const handleDelete = async (product) => {
        if (!window.confirm(`¿Eliminar "${product.nombre}"? Dejará de mostrarse en la tienda.`)) return

        try {
            await deleteProduct(product.id)
            setNotice({ tone: "success", text: `El producto "${product.nombre}" se eliminó del catálogo.` })
            refresh()
        } catch (error) {
            setNotice({ tone: "error", text: error.message })
        }
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
            matchesAllWords(`${product.nombre} ${product.categoriaNombre}`, search) &&
            (category === "" || product.categoria === category) &&
            (status === "" || product.estadoStock === status),
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
                        onClick={() => setEditor({ product: null })}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Plus className="size-5" />
                        Agregar producto
                    </button>
                }
            />

            {/* Aviso después de agregar, editar o eliminar */}
            {notice && (
                <Notice tone={notice.tone} onClose={() => setNotice(null)}>
                    {notice.text}
                </Notice>
            )}

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
                {loading ? (
                    <PageLoader text="Cargando productos..." />
                ) : loadError ? (
                    <ErrorMessage onRetry={loadProducts}>{loadError}</ErrorMessage>
                ) : total === 0 ? (
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
                        <ProductsTable
                            products={pageItems}
                            onEdit={(product) => setEditor({ product })}
                            onDelete={handleDelete}
                        />

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500">{summary}</p>
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    </>
                )}
            </section>

            <Modal
                open={editor !== null}
                onClose={() => setEditor(null)}
                title={editor?.product ? "Editar producto" : "Agregar producto"}
            >
                {/* key: al abrir otro producto, el formulario parte de cero con sus datos */}
                {editor && (
                    <ProductForm
                        key={editor.product?.id ?? "nuevo"}
                        initialValues={editor.product ? productToForm(editor.product) : emptyProduct}
                        editing={editor.product !== null}
                        onCancel={() => setEditor(null)}
                        onSubmit={handleSave}
                    />
                )}
            </Modal>
        </>
    )
}
