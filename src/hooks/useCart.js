import { useContext } from "react"
import { CartContext } from "../context/cartContext"

// Hook propio: atajo para acceder al carrito desde cualquier componente
// Uso:  const { cartItems, addToCart } = useCart()
export default function useCart() {
    const context = useContext(CartContext)

    // Si se usa fuera del provider, avisa con un error claro en vez de fallar más adelante
    if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>")

    return context
}
