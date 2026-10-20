import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CartProvider, useCart } from "./CartContext"

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

const product = {
    id: "TEST001",
    nombre: "Producto de prueba",
    precio: 2500,
    stock: 3,
    unidad: "Unidad",
}

describe("CartContext", () => {
    it("combina productos repetidos, limita el stock y persiste el carrito", async () => {
        const { result } = renderHook(() => useCart(), { wrapper })

        act(() => {
            result.current.addToCart(product, 2)
            result.current.addToCart(product, 5)
        })

        expect(result.current.cartItems).toHaveLength(1)
        expect(result.current.cartItems[0]).toMatchObject({ id: "TEST001", cantidad: 3 })
        await waitFor(() => {
            expect(JSON.parse(localStorage.getItem("cart"))).toMatchObject([
                { id: "TEST001", cantidad: 3 },
            ])
        })
    })

    it("respeta los límites de cantidad y permite quitar o vaciar productos", () => {
        const { result } = renderHook(() => useCart(), { wrapper })

        act(() => result.current.addToCart(product))
        act(() => result.current.decreaseQuantity("TEST001"))
        expect(result.current.cartItems[0].cantidad).toBe(1)

        act(() => result.current.increaseQuantity("TEST001"))
        act(() => result.current.increaseQuantity("TEST001"))
        act(() => result.current.increaseQuantity("TEST001"))
        expect(result.current.cartItems[0].cantidad).toBe(3)

        act(() => result.current.removeFromCart("TEST001"))
        expect(result.current.cartItems).toEqual([])

        act(() => {
            result.current.addToCart(product)
            result.current.clearCart()
        })
        expect(result.current.cartItems).toEqual([])
    })
})
