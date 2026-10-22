import { useEffect, useState } from "react"
import { products } from "../mocks/products"
import { CartContext } from "./cartContext"

// Nombre del carrito dentro del localStorage del navegador
const STORAGE_KEY = "cart"

// Lee el carrito guardado en localStorage.
// Solo se guarda { id, cantidad } de cada producto: el precio, el nombre y el stock
// se leen siempre del catálogo, así nunca quedan desactualizados.
// Si no hay nada guardado (o está corrupto) devuelve un arreglo vacío.
const loadCart = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (!Array.isArray(saved)) return []

        // Descarta lo que no tenga la forma esperada
        return saved
            .filter((item) => typeof item?.id === "string" && Number.isInteger(item.cantidad) && item.cantidad > 0)
            .map(({ id, cantidad }) => ({ id, cantidad }))
    } catch {
        // Si JSON.parse falla parte con un carrito vacío
        return []
    }
}

// Componente que envuelve la página y le entrega el carrito a todos sus hijos.
// catalog: lista de productos donde se buscan los datos de cada línea
// (por defecto el mock; en la fase 2 vendrá del backend).
export function CartProvider({ children, catalog = products }) {
    // items: arreglo de { id, cantidad }.
    // Le pasamos la función loadCart (sin paréntesis) para que React la ejecute UNA sola vez, al crear el estado.
    const [items, setItems] = useState(loadCart)

    // Cada vez que items cambia, lo guarda en localStorage
    useEffect(() => {
        // JSON.stringify convierte el arreglo a texto, que es lo único que localStorage acepta
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }, [items]) // [items]: el efecto se ejecuta solo cuando este valor cambia

    const findProduct = (id) => catalog.find((product) => product.id === id)

    // Líneas del carrito con los datos actuales del catálogo.
    // Si un producto ya no existe o se quedó sin stock, no se muestra;
    // si el stock bajó, la cantidad se ajusta al nuevo máximo.
    const cartItems = items.flatMap(({ id, cantidad }) => {
        const product = findProduct(id)
        if (!product || product.stock <= 0) return []
        return [{ ...product, cantidad: Math.min(cantidad, product.stock) }]
    })

    // Totales: unidades (el número del contador) y suma de precio x cantidad
    const totalUnits = cartItems.reduce((total, item) => total + item.cantidad, 0)
    const subtotal = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0)

    // Agrega un producto al carrito con la cantidad indicada (por defecto 1).
    // Si ya estaba, suma esa cantidad. La cantidad total nunca pasa del stock.
    const addToCart = (product, quantity = 1) => {
        setItems((prev) => {
            // ¿ya hay en el carrito un producto con este id?
            const exists = prev.some((item) => item.id === product.id)

            if (exists) {
                // Copia el carrito; solo cambia el producto que coincide.
                // Math.min elige el menor: lo que ya había + lo nuevo, o el stock si se pasa.
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, cantidad: Math.min(item.cantidad + quantity, product.stock) }
                        : item,
                )
            }

            // No estaba: lo agrega con la cantidad pedida (sin pasar del stock)
            return [...prev, { id: product.id, cantidad: Math.min(quantity, product.stock) }]
        })
    }

    // Suma 1 a la cantidad del producto con ese id, sin pasar del stock disponible
    const increaseQuantity = (id) => {
        const stock = findProduct(id)?.stock ?? 0

        setItems((prev) =>
            prev.map(
                (item) =>
                    // Solo cambia el producto que coincide Y que todavía tiene stock para uno más
                    item.id === id && item.cantidad < stock ? { ...item, cantidad: item.cantidad + 1 } : item, // los demás se dejan igual
            ),
        )
    }

    // Resta 1 a la cantidad del producto con ese id, sin bajar de 1
    const decreaseQuantity = (id) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item)),
        )
    }

    // Elimina del carrito el producto con ese id.
    // filter crea un arreglo nuevo solo con los productos cuyo id es DISTINTO al que se quiere quitar.
    const removeFromCart = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    // Deja el carrito vacío
    const clearCart = () => {
        setItems([])
    }

    return (
        // value: lo que queda disponible para los componentes que usen el contexto.
        // Toda función que se quiera usar afuera TIENE que estar en esta lista.
        <CartContext.Provider
            value={{
                cartItems,
                totalUnits,
                subtotal,
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
