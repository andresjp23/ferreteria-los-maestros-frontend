import useCart from "../../hooks/useCart"
import SectionTitle from "../ui/SectionTitle"
import { formatPrice } from "../../utils/format"

export default function CartSummary() {
    // Carrito real y la función para vaciarlo, desde el contexto
    const { cartItems, totalUnits, subtotal, clearCart } = useCart()

    // true si no hay ningún producto en el carrito
    const isEmpty = cartItems.length === 0

    // Pide confirmación antes de vaciar, porque no se puede deshacer.
    // window.confirm abre un cuadro con Aceptar/Cancelar y devuelve true si se acepta.
    const handleClearCart = () => {
        if (window.confirm("¿Quieres vaciar todo el carrito?")) {
            clearCart()
        }
    }

    return (
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <SectionTitle className="mb-7">Resumen del pedido</SectionTitle>

            <div className="space-y-5 text-sm">
                <div className="flex justify-between gap-4">
                    {/* Singular o plural según la cantidad de unidades */}
                    <span className="text-slate-500">
                        Subtotal ({totalUnits} {totalUnits === 1 ? "unidad" : "unidades"})
                    </span>
                    <span className="font-semibold text-secondary">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Descuento</span>
                    <span className="text-secondary">{formatPrice(0)}</span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Envío</span>
                    <span className="text-right text-slate-500">Calculado en el siguiente paso</span>
                </div>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-bold text-secondary">Total</span>
                {/* Por ahora el total es igual al subtotal (descuento 0 y envío aún no calculado) */}
                <span className="text-2xl font-extrabold text-primary">{formatPrice(subtotal)}</span>
            </div>

            {/* El checkout llega con el backend: por ahora el botón queda deshabilitado y lo explica */}
            <button
                type="button"
                disabled
                aria-describedby="checkout-note"
                className="mt-7 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white opacity-50"
            >
                Continuar con la compra →
            </button>
            <p id="checkout-note" className="mt-2 text-center text-xs text-slate-500">
                El pago en línea estará disponible próximamente.
            </p>

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
    )
}
