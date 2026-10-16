import { createContext, useContext, useEffect, useState } from "react"

// Nombre del carrito dentro del localStorage del navegador
const STORAGE_KEY = "cart"

// Crea el contexto (espacio compartido) del carrito
const CartContext = createContext()

// Lee el carrito guardado en localStorage.
// Si no hay nada guardado devuelve un arreglo vacío.
const loadCart = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)

        // JSON.parse convierte el texto guardado de vuelta a un arreglo de JavaScript
        return saved ? JSON.parse(saved) : []
    } catch {
        // Si JSON.parse falla parte con un carrito vacío
        return []
    }
}

// Componente que envuelve la página y le entrega el carrito a todos sus hijos
export function CartProvider({ children }) {
    // cartItems: arreglo con los productos del carrito.
    // Le pasamos la función loadCart (sin paréntesis) para que React la ejecute UNA sola vez, al crear el estado.
    const [cartItems, setCartItems] = useState(loadCart)

    // Cada vez que cartItems cambia, lo guarda en localStorage
    useEffect(() => {
        // JSON.stringify convierte el arreglo a texto, que es lo único que localStorage acepta
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    }, [cartItems]) // [cartItems]: el efecto se ejecuta solo cuando este valor cambia

    // Agrega un producto al carrito con la cantidad indicada (por defecto 1).
    // Si ya estaba, suma esa cantidad. La cantidad total nunca pasa del stock.
    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            // ¿ya hay en el carrito un producto con este id?
            const exists = prev.some(item => item.id === product.id)

            if (exists) {
                // Copia el carrito; solo cambia el producto que coincide.
                // Math.min elige el menor: lo que ya había + lo nuevo, o el stock si se pasa.
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: Math.min(item.cantidad + quantity, item.stock) }
                        : item
                )
            }

            // No estaba: lo agrega con la cantidad pedida (sin pasar del stock)
            return [...prev, { ...product, cantidad: Math.min(quantity, product.stock) }]
        })
    }

    // Suma 1 a la cantidad del producto con ese id, sin pasar del stock disponible
    const increaseQuantity = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                // Solo cambia el producto que coincide Y que todavía tiene stock para uno más
                item.id === id && item.cantidad < item.stock
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item // los demás se dejan igual
            )
        )
    }

    // Resta 1 a la cantidad del producto con ese id, sin bajar de 1
    const decreaseQuantity = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.cantidad > 1
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
        )
    }

    // Elimina del carrito el producto con ese id.
    // filter crea un arreglo nuevo solo con los productos cuyo id es DISTINTO al que se quiere quitar.
    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id))
    }

    // Deja el carrito vacío
    const clearCart = () => {
        setCartItems([])
    }

    return (
        // value: lo que queda disponible para los componentes que usen el contexto.
        // Toda función que se quiera usar afuera TIENE que estar en esta lista.
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

// Hook propio: atajo para acceder al carrito desde cualquier componente
// Uso:  const { cartItems, addToCart } = useCart()
export function useCart() {
    return useContext(CartContext)
}