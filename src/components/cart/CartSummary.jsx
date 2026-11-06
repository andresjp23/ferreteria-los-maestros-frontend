import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import useAuth from "../../hooks/useAuth"
import useCart from "../../hooks/useCart"
import useCatalog from "../../hooks/useCatalog"
import { createOrder } from "../../services/orderService"
import SectionTitle from "../ui/SectionTitle"
import { formatPrice } from "../../utils/format"

export default function CartSummary() {
    // Carrito real y la función para vaciarlo, desde el contexto
    const { cartItems, totalUnits, subtotal, clearCart } = useCart()
    const { user } = useAuth()
    const { reload: reloadCatalog } = useCatalog()
    const navigate = useNavigate()
    const location = useLocation()

    // Estado del checkout: enviando, error del backend y pedido creado
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [order, setOrder] = useState(null)

    // true si no hay ningún producto en el carrito
    const isEmpty = cartItems.length === 0

    // Solo los clientes compran. Admin y vendedor ven el botón deshabilitado con la explicación.
    const isStaff = user !== null && user.rol !== "cliente"

    // Pide confirmación antes de vaciar, porque no se puede deshacer.
    // window.confirm abre un cuadro con Aceptar/Cancelar y devuelve true si se acepta.
    const handleClearCart = () => {
        if (window.confirm("¿Quieres vaciar todo el carrito?")) {
            clearCart()
        }
    }

    const handleCheckout = async () => {
        setError("")

        // Sin sesión: al login, y después de entrar vuelve al carrito (ProtectedRoute usa la misma idea)
        if (!user) {
            navigate("/login", { state: { from: location } })
            return
        }

        setSubmitting(true)
        try {
            // El backend valida el stock, lo descuenta y calcula el total con sus propios precios
            const created = await createOrder(cartItems)
            setOrder(created)
            clearCart()
            // El stock cambió: se vuelve a pedir el catálogo para que todas las vistas lo muestren al día
            reloadCatalog()
        } catch (err) {
            // 409: un producto no tiene stock suficiente o ya no existe. El mensaje dice cuál.
            setError(err.message)
            if (err.status === 409) reloadCatalog()
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <SectionTitle className="mb-7">Resumen del pedido</SectionTitle>

            {/* Confirmación del pedido recién creado */}
            {order && (
                <div
                    role="status"
                    className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                >
                    <p className="font-semibold">¡Pedido #{order.id} creado!</p>
                    <p className="mt-1">
                        Total pagado: {formatPrice(order.total)}. Estado: {order.estado}.
                    </p>
                </div>
            )}

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
                    <span className="text-right text-slate-500">Se coordina al despachar</span>
                </div>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-bold text-secondary">Total</span>
                {/* El total es igual al subtotal (sin descuento ni envío). El backend lo vuelve a calcular. */}
                <span className="text-2xl font-extrabold text-primary">{formatPrice(subtotal)}</span>
            </div>

            {/* Error del backend (por ejemplo, stock insuficiente) */}
            {error && (
                <p
                    role="alert"
                    className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    {error}
                </p>
            )}

            <button
                type="button"
                onClick={handleCheckout}
                disabled={isEmpty || isStaff || submitting}
                aria-describedby="checkout-note"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {submitting ? "Procesando pedido..." : "Continuar con la compra →"}
            </button>
            <p id="checkout-note" className="mt-2 text-center text-xs text-slate-500">
                {isStaff
                    ? "Las compras se hacen con una cuenta de cliente."
                    : user
                      ? "El pago se realiza al momento del despacho o retiro."
                      : "Inicia sesión como cliente para completar tu compra."}
            </p>

            {/* Con el carrito vacío no se puede hacer clic */}
            <button
                type="button"
                onClick={handleClearCart}
                disabled={isEmpty || submitting}
                className="mt-3 w-full rounded-lg border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
                Vaciar carrito
            </button>
        </aside>
    )
}
