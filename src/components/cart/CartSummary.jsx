import { Link } from "react-router";
import { useCart } from "../../context/CartContext";

const formatPrice = (price) =>
  `$${price.toLocaleString("es-CL")}`;

export default function CartSummary() {
  // Carrito real y la función para vaciarlo, desde el contexto
  const { cartItems, clearCart } = useCart();

  // true si no hay ningún producto en el carrito
  const isEmpty = cartItems.length === 0;

  // reduce recorre el carrito y va acumulando UN solo valor.
  // "total" es lo acumulado hasta ese momento (parte en 0, el segundo argumento)
  // e "item" es el producto de la vuelta actual.
  // En cada vuelta suma: precio de una unidad x cantidad de ese producto.
  const subtotal = cartItems.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  // Mismo reduce, pero suma solo las cantidades: cuántas unidades hay en total
  const totalUnits = cartItems.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  // Pide confirmación antes de vaciar, porque no se puede deshacer.
  // window.confirm abre un cuadro con Aceptar/Cancelar y devuelve true si se acepta.
  const handleClearCart = () => {
    if (window.confirm("¿Quieres vaciar todo el carrito?")) {
      clearCart();
    }
  };

  return (
    <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <h2 className="mb-7 flex items-center gap-3 text-lg font-bold text-secondary">
        <span className="h-1 w-7 rounded bg-primary" />
        Resumen del pedido
      </h2>

      <div className="space-y-5 text-sm">
        <div className="flex justify-between gap-4">
          {/* Singular o plural según la cantidad de unidades */}
          <span className="text-slate-500">
            Subtotal ({totalUnits} {totalUnits === 1 ? "unidad" : "unidades"})
          </span>
          <span className="font-semibold text-secondary">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Descuento</span>
          <span className="text-secondary">{formatPrice(0)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Envío</span>
          <span className="text-right text-slate-500">
            Calculado en el siguiente paso
          </span>
        </div>
      </div>

      <div className="my-6 border-t border-slate-200" />

      <div className="flex items-center justify-between gap-3">
        <span className="text-lg font-bold text-secondary">Total</span>
        {/* Por ahora el total es igual al subtotal (descuento 0 y envío aún no calculado) */}
        <span className="text-2xl font-extrabold text-primary">
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* Un Link no tiene "disabled", así que se simula:
          - pointer-events-none: el mouse ya no puede hacer clic
          - tabIndex -1: el teclado (Tab) lo salta
          - aria-disabled: avisa a los lectores de pantalla que está desactivado */}
      <Link
        to="/productos"
        aria-disabled={isEmpty}
        tabIndex={isEmpty ? -1 : 0}
        className={`mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition ${
          isEmpty ? "pointer-events-none opacity-50" : "hover:bg-amber-700"
        }`}
      >
        Continuar con la compra →
      </Link>

      {/* Un botón sí tiene "disabled": con el carrito vacío no se puede hacer clic */}
      <button
        type="button"
        onClick={handleClearCart}
        disabled={isEmpty}
        className="mt-3 w-full rounded-lg border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        Vaciar carrito
      </button>
    </aside>
  );
}