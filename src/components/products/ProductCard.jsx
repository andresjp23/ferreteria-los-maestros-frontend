import { ShoppingCart } from "lucide-react"

export default function ProductCard({ image, categoria, nombre, precio, unidad, stock, onAddToCart }) {
    // Precio en pesos chilenos: 5990 -> $5.990
    const precioFormateado = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(precio)

    // "Unidad" se muestra como c/u. El resto, tal cual: "Saco" -> "/ saco"
    const unidadTexto =
        unidad === "Unidad" ? "c/u" : `/ ${unidad.charAt(0).toLowerCase()}${unidad.slice(1)}`

    const hayStock = stock > 0

    return (
        <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            {/* Imagen (la de la categoría) */}
            <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {image && (
                    <img
                        src={image}
                        alt=""
                        className="size-full object-contain"
                    />
                )}
            </div>

            {/* Información */}
            <div className="mt-3 flex flex-1 flex-col gap-1">
                <p className="text-xs text-gray-500">{categoria}</p>

                <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-secondary">
                    {nombre}
                </h3>

                <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-secondary">{precioFormateado}</span>
                    <span className="text-xs text-gray-500">{unidadTexto}</span>
                </p>

                <p className="flex items-center gap-2 text-xs text-gray-600">
                    <span
                        className={`size-2 rounded-full ${hayStock ? "bg-green-500" : "bg-red-500"}`}
                    />
                    {hayStock ? "En stock" : "Sin stock"}
                </p>
            </div>

            {/* Botón */}
            <button
                type="button"
                onClick={onAddToCart}
                disabled={!hayStock}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ShoppingCart className="size-4" />
                Agregar al carrito
            </button>
        </article>
    )
}