import { Link } from "react-router"
import { ShoppingCart } from "lucide-react"
import { formatPrice, formatUnit } from "../../utils/format"
import { getCategoryName } from "../../utils/catalog"

export default function ProductCard({ product, onAddToCart }) {
    const { id, image, categoria, nombre, precio, unidad, stock } = product
    const hayStock = stock > 0

    return (
        // El article es solo el contenedor visual. Ya no es un enlace.
        <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            {/* ZONA CON ENLACE: imagen + datos. Un clic aquí lleva al detalle del producto.
                flex-1 hace que ocupe el espacio sobrante y empuje el botón hacia abajo. */}
            <Link to={`/productos/${id}`} className="group flex flex-1 flex-col">
                {/* Imagen. loading="lazy": se descarga recién cuando está por entrar en pantalla */}
                <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {image && (
                        <img src={image} alt="" loading="lazy" decoding="async" className="size-full object-contain" />
                    )}
                </div>

                {/* Información */}
                <div className="mt-3 flex flex-1 flex-col gap-1">
                    <p className="text-xs text-gray-500">{getCategoryName(categoria)}</p>

                    {/* group-hover: el nombre cambia de color al pasar el mouse por toda la zona con enlace */}
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-secondary transition-colors group-hover:text-primary">
                        {nombre}
                    </h3>

                    <p className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-bold text-secondary">{formatPrice(precio)}</span>
                        <span className="text-xs text-gray-500">{formatUnit(unidad)}</span>
                    </p>

                    <p className="flex items-center gap-2 text-xs text-gray-600">
                        <span className={`size-2 rounded-full ${hayStock ? "bg-green-500" : "bg-red-500"}`} />
                        {hayStock ? "En stock" : "Sin stock"}
                    </p>
                </div>
            </Link>

            {/* BOTÓN: fuera del Link, así su clic no navega a ningún lado */}
            <button
                type="button"
                onClick={onAddToCart}
                disabled={!hayStock}
                aria-label={`Agregar ${nombre} al carrito`}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ShoppingCart className="size-4" />
                Agregar al carrito
            </button>
        </article>
    )
}
