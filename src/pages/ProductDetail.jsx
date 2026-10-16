import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { ChevronRight, Minus, Plus, ShoppingCart, Truck, Store } from "lucide-react"
import { products } from "../mocks/products"
import ProductCard from "../components/products/ProductCard"
import { useCart } from "../context/CartContext"

// Nombre bonito de cada categoría (el slug es el valor de product.categoria)
const categoryLabels = {
    "materiales-construccion": "Materiales de construcción",
    pinturas: "Pinturas",
    herramientas: "Herramientas",
    gasfiteria: "Gasfitería",
    electricidad: "Electricidad",
    tornilleria: "Tornillería",
    madera: "Madera",
    seguridad: "Seguridad",
    jardin: "Jardín",
}

// 5990 -> "$5.990"
const formatPrice = (value) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value)

// Título de sección con la barrita naranja (igual que en el resto del sitio)
function SectionTitle({ children }) {
    return (
        <h2 className="flex items-center gap-3 text-lg font-bold text-secondary md:text-xl">
            <span className="h-1 w-6 rounded-full bg-primary md:w-8" />
            {children}
        </h2>
    )
}

export default function ProductDetail() {
    const { id } = useParams() // el :id de /productos/:id
    const navigate = useNavigate()
    const { addToCart, cartItems } = useCart()

    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false) // true después de agregar al carrito

    // Al cambiar de producto: cantidad en 1, sin aviso y vuelve arriba de la página
    useEffect(() => {
        setQuantity(1)
        setAdded(false)
        window.scrollTo(0, 0)
    }, [id])

    const product = products.find((p) => p.id === id)

    // Si el id no existe
    if (!product) {
        return (
            <section className="px-6 py-16 text-center md:px-10 xl:px-20">
                <title>Producto no encontrado | Ferretería Los Maestros</title>
                <h1 className="text-xl font-bold text-secondary md:text-2xl">Producto no encontrado</h1>
                <p className="mt-2 text-sm text-gray-600">
                    El producto que buscas no existe o ya no está disponible.
                </p>
                <Link
                    to="/productos"
                    className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                    Volver a productos
                </Link>
            </section>
        )
    }

    const inStock = product.stock > 0
    const categoryName = categoryLabels[product.categoria] ?? product.categoria

    // "Unidad" se muestra como c/u. El resto, tal cual: "Saco" -> "/ saco"
    const unitText =
        product.unidad === "Unidad"
            ? "c/u"
            : `/ ${product.unidad.charAt(0).toLowerCase()}${product.unidad.slice(1)}`

    // La cantidad nunca baja de 1 ni pasa del stock
    const decrease = () => setQuantity((q) => Math.max(1, q - 1))
    const increase = () => setQuantity((q) => Math.min(product.stock, q + 1))

    // Agrega al carrito la cantidad elegida y muestra el aviso
    const handleAddToCart = () => {
        addToCart(product, quantity)
        setAdded(true)
    }

    // Comprar ahora: agrega el producto solo si todavía no está en el carrito, y va al carrito.
    const handleBuyNow = () => {
        // some devuelve true si algún producto del carrito tiene este mismo id
        const alreadyInCart = cartItems.some((item) => item.id === product.id)

        // Solo agrega si no estaba, para no duplicar la cantidad
        if (!alreadyInCart) {
            addToCart(product, quantity)
        }

        navigate("/carrito")
    }

    // Datos de la tabla "Detalles del producto"
    const details = [
        { label: "Código", value: product.id },
        { label: "Marca", value: product.marca },
        { label: "Categoría", value: categoryName },
        { label: "Subcategoría", value: product.subcategoria },
        { label: "Unidad de venta", value: product.unidad },
        { label: "Disponibilidad", value: inStock ? `${product.stock} unidades` : "Sin stock" },
    ]

    // Hasta 4 productos de la misma categoría, sin contar el actual
    const related = products
        .filter((p) => p.categoria === product.categoria && p.id !== product.id)
        .slice(0, 4)

    return (
        <section className="px-6 py-8 md:px-10 md:py-10 xl:px-20 xl:py-12">
            <title>{`${product.nombre} | Ferretería Los Maestros`}</title>

            {/* Migas de pan */}
            <nav
                aria-label="Ruta de navegación"
                className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500"
            >
                <Link to="/" className="transition-colors hover:text-primary">Inicio</Link>
                <ChevronRight className="size-4 shrink-0" />
                <Link to="/productos" className="transition-colors hover:text-primary">Productos</Link>
                <ChevronRight className="size-4 shrink-0" />
                <span aria-current="page" className="font-medium text-secondary">
                    {product.nombre}
                </span>
            </nav>

            {/* Tarjeta principal: foto + información */}
            <div className="grid gap-6 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-2 md:gap-8 md:p-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                {/* Foto */}
                <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-4">
                    <img
                        src={product.image}
                        alt={product.nombre}
                        className="size-full object-contain"
                    />
                </div>

                {/* Información */}
                <div className="flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {categoryName}
                    </p>

                    <h1 className="mt-1 text-xl font-bold leading-tight text-secondary md:text-2xl">
                        {product.nombre}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Marca: <span className="font-medium text-gray-700">{product.marca}</span>
                        {" · "}
                        Código: <span className="font-medium text-gray-700">{product.id}</span>
                    </p>

                    {/* Precio */}
                    <p className="mt-5 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-secondary md:text-3xl">
                            {formatPrice(product.precio)}
                        </span>
                        <span className="text-sm text-gray-500">{unitText}</span>
                    </p>

                    {/* Stock */}
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <span
                            className={`size-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`}
                        />
                        {inStock ? `En stock · ${product.stock} disponibles` : "Sin stock"}
                    </p>

                    {/* Cantidad y botones */}
                    <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Cantidad</span>

                            <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <button
                                    type="button"
                                    onClick={decrease}
                                    disabled={!inStock || quantity <= 1}
                                    aria-label="Disminuir cantidad"
                                    className="flex size-10 items-center justify-center bg-gray-50 text-secondary transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-gray-50"
                                >
                                    <Minus className="size-4" />
                                </button>

                                <span
                                    aria-live="polite"
                                    className="w-10 text-center text-sm font-semibold text-secondary"
                                >
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={increase}
                                    disabled={!inStock || quantity >= product.stock}
                                    aria-label="Aumentar cantidad"
                                    className="flex size-10 items-center justify-center bg-gray-50 text-secondary transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-gray-50"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 xl:flex-row">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ShoppingCart className="size-4" />
                                Agregar al carrito
                            </button>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={!inStock}
                                className="flex flex-1 items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Comprar ahora
                            </button>
                        </div>

                        {/* Aviso después de agregar */}
                        {added && (
                            <p className="text-sm text-green-600">
                                Producto agregado al carrito.{" "}
                                <Link to="/carrito" className="font-semibold underline">
                                    Ver carrito
                                </Link>
                            </p>
                        )}
                    </div>

                    {/* Despacho y retiro */}
                    <ul className="mt-6 grid gap-3 border-t border-gray-200 pt-5 text-sm text-gray-600">
                        <li className="flex items-center gap-3">
                            <Truck className="size-5 shrink-0 text-primary" strokeWidth={1.5} />
                            Despacho a domicilio en la zona de cobertura
                        </li>
                        <li className="flex items-center gap-3">
                            <Store className="size-5 shrink-0 text-primary" strokeWidth={1.5} />
                            Retiro en tienda, rápido y fácil
                        </li>
                    </ul>
                </div>
            </div>

            {/* Detalles del producto */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                <SectionTitle>Detalles del producto</SectionTitle>

                <dl className="mt-5 grid gap-x-10 gap-y-3 text-sm md:grid-cols-2">
                    {details.map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex justify-between gap-4 border-b border-gray-100 pb-3"
                        >
                            <dt className="text-gray-500">{label}</dt>
                            <dd className="text-right font-medium text-secondary">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Productos relacionados */}
            {related.length > 0 && (
                <div className="mt-10">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <SectionTitle>Productos relacionados</SectionTitle>
                        <Link
                            to="/productos"
                            className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
                        >
                            Ver todos
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {related.map((p) => (
                            <ProductCard
                                key={p.id}
                                id={p.id}
                                image={p.image}
                                categoria={categoryLabels[p.categoria]}
                                nombre={p.nombre}
                                precio={p.precio}
                                unidad={p.unidad}
                                stock={p.stock}
                                onAddToCart={() => addToCart(p)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}