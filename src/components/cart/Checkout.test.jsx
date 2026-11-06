import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router"
import { AuthProvider } from "../../context/AuthProvider"
import { CatalogProvider } from "../../context/CatalogProvider"
import { CartProvider } from "../../context/CartProvider"
import { apiError, fakeToken, mockApi } from "../../test/mockApi"
import { catalogRoutes, users } from "../../test/fixtures"
import Cart from "../../pages/Cart"

const renderCart = () =>
    render(
        <MemoryRouter initialEntries={["/carrito"]}>
            <AuthProvider>
                <CatalogProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/carrito" element={<Cart />} />
                            <Route path="/login" element={<p>Página de login</p>} />
                        </Routes>
                    </CartProvider>
                </CatalogProvider>
            </AuthProvider>
        </MemoryRouter>,
    )

const loginAs = (usuario) => {
    localStorage.setItem("auth_token", fakeToken())
    return { "GET /auth/me": usuario }
}

const checkoutButton = () => screen.getByRole("button", { name: /Continuar con la compra/ })

describe("checkout", () => {
    it("el cliente compra: se envían códigos y cantidades, se vacía el carrito y se confirma el pedido", async () => {
        localStorage.setItem("cart", JSON.stringify([{ id: "HE001", cantidad: 2 }]))
        let sent
        mockApi({
            ...catalogRoutes,
            ...loginAs(users.cliente),
            "POST /pedidos": ({ body }) => {
                sent = body
                return { id: 16, total: 159980, estado: "En preparación" }
            },
        })
        const user = userEvent.setup()
        renderCart()

        await screen.findByRole("heading", { name: "Productos en tu carrito (1)" })
        await user.click(checkoutButton())

        const confirmation = await screen.findByText("¡Pedido #16 creado!")
        expect(within(confirmation.parentElement).getByText(/Total pagado: \$159\.980/)).toBeInTheDocument()
        expect(sent).toEqual({ items: [{ id: "HE001", cantidad: 2 }] })
        expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument()
    })

    it("muestra el 409 del backend cuando no hay stock suficiente y no vacía el carrito", async () => {
        localStorage.setItem("cart", JSON.stringify([{ id: "HE001", cantidad: 2 }]))
        mockApi({
            ...catalogRoutes,
            ...loginAs(users.cliente),
            "POST /pedidos": apiError(409, 'Stock insuficiente para "Taladro percutor 650W 13mm": quedan 1 unidades'),
        })
        const user = userEvent.setup()
        renderCart()

        await screen.findByRole("heading", { name: "Productos en tu carrito (1)" })
        await user.click(checkoutButton())

        expect(await screen.findByRole("alert")).toHaveTextContent("Stock insuficiente")
        expect(screen.getByRole("heading", { name: "Productos en tu carrito (1)" })).toBeInTheDocument()
    })

    it("sin sesión, el botón lleva al login", async () => {
        localStorage.setItem("cart", JSON.stringify([{ id: "MC001", cantidad: 1 }]))
        mockApi(catalogRoutes)
        const user = userEvent.setup()
        renderCart()

        await screen.findByRole("heading", { name: "Productos en tu carrito (1)" })
        await user.click(checkoutButton())

        expect(await screen.findByText("Página de login")).toBeInTheDocument()
    })

    it("admin y vendedor no pueden comprar", async () => {
        localStorage.setItem("cart", JSON.stringify([{ id: "MC001", cantidad: 1 }]))
        mockApi({ ...catalogRoutes, ...loginAs(users.vendedor) })
        renderCart()

        expect(await screen.findByText("Las compras se hacen con una cuenta de cliente.")).toBeInTheDocument()
        expect(checkoutButton()).toBeDisabled()
    })
})
