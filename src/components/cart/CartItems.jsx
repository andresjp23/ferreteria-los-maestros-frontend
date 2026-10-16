import { useCart } from "../../context/CartContext"
import { categories } from "../../mocks/categories"
import { Link } from "react-router"
import { ShoppingCart, ArrowRight, Trash2 } from "lucide-react"

const formatPrice = (price) =>
  `$${price.toLocaleString("es-CL")}`;



export default function CartItems() {
  // Carrito real y las funciones para modificarlo
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

  // Si el carrito está vacío, muestra un mensaje en vez de la lista.
  // "return" corta la función aquí: el resto del componente no se ejecuta.
  if (cartItems.length === 0) {
    return (
      <section className="flex flex-col items-center rounded-lg border border-slate-200 bg-white px-6 py-14 text-center">
        <ShoppingCart className="size-14 text-slate-300" strokeWidth={1.5} />

        <h2 className="mt-4 text-xl font-bold text-secondary">
          Tu carrito está vacío
        </h2>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Aún no has agregado productos. Explora el catálogo y encuentra lo que necesitas para tu proyecto.
        </p>

        <Link
          to="/productos"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Ver productos
          <ArrowRight className="size-4" />
        </Link>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-6">

      <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-secondary md:text-xl">
        <span className="h-1 w-7 rounded bg-primary" />
        Productos en tu carrito ({cartItems.length})
      </h2>

      <div className="divide-y divide-slate-200">
        {cartItems.map((item) => {
          // Busca el nombre visible de la categoría a partir de su id
          const categoryName = categories.find((c) => c.id === item.categoria)?.nombre

          // "Unidad" se muestra como c/u. Cualquier otra: "Saco" -> "/ saco"
          const unitText =
            item.unidad === "Unidad"
              ? "c/u"
              : `/ ${item.unidad.charAt(0).toLowerCase()}${item.unidad.slice(1)}`

          return (
            <article
              key={item.id}
              className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center"
            >
              <img
                src={item.image}
                alt={item.nombre}
                className="h-24 w-24 rounded-lg border border-slate-200 object-contain"
              />

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-secondary">
                  {item.nombre}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {categoryName}
                </p>

                {/* Precio de UNA unidad */}
                <p className="mt-2 font-semibold text-primary">
                  {formatPrice(item.precio)} {unitText}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-start">
                {/* Selector de cantidad */}
                <div className="flex items-center rounded-lg border border-slate-200">
                  <button
                    type="button"
                    // () => ... es necesaria porque la función recibe un dato (el id).
                    // Sin la flecha, se ejecutaría al dibujar la página y no al hacer clic.
                    onClick={() => decreaseQuantity(item.id)}
                    // Se deshabilita cuando la cantidad ya está en el mínimo (1)
                    disabled={item.cantidad <= 1}
                    aria-label={`Disminuir cantidad de ${item.nombre}`}
                    className="px-3 py-2 text-secondary hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                  >
                    −
                  </button>

                  <span className="border-x border-slate-200 px-4 py-2 text-sm">
                    {item.cantidad}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    // Se deshabilita cuando la cantidad ya llegó al stock disponible
                    disabled={item.cantidad >= item.stock}
                    aria-label={`Aumentar cantidad de ${item.nombre}`}
                    className="px-3 py-2 text-secondary hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                  >
                    +
                  </button>
                </div>

                {/* Total de esta línea: precio de una unidad x cantidad */}
                <p className="min-w-20 text-right font-bold text-secondary">
                  {formatPrice(item.precio * item.cantidad)}
                </p>

                {/* Eliminar el producto del carrito */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Eliminar ${item.nombre} del carrito`}
                  className="text-slate-400 transition hover:text-red-500"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  );
}