import { createContext } from "react"

// Espacio compartido del carrito. Lo llena CartProvider y se lee con el hook useCart.
export const CartContext = createContext(null)
