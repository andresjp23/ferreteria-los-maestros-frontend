import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes, useLocation, useNavigationType } from "react-router"
import { CartProvider } from "../context/CartContext"
import Products from "./Products"

function RouterState() {
    const location = useLocation()
    const navigationType = useNavigationType()

    return (
        <output data-testid="router-state">
            {location.pathname}{location.search}|{navigationType}
        </output>
    )
}

describe("búsqueda del catálogo", () => {
    it("filtra al escribir, reemplaza la URL y conserva otros parámetros al limpiar", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={["/productos?categoria=herramientas"]}>
                <CartProvider>
                    <Routes>
                        <Route path="/productos" element={<Products />} />
                    </Routes>
                    <RouterState />
                </CartProvider>
            </MemoryRouter>,
        )

        const search = screen.getByRole("searchbox", { name: "Buscar productos" })
        await user.type(search, "taladro")

        expect(await screen.findByRole("heading", { name: "Taladro percutor 650W 13mm" })).toBeInTheDocument()
        expect(screen.getByText("Mostrando 1 productos")).toBeInTheDocument()
        expect(screen.getByTestId("router-state")).toHaveTextContent(
            "/productos?categoria=herramientas&q=taladro|REPLACE",
        )

        await user.clear(search)
        await waitFor(() => {
            expect(screen.getByTestId("router-state")).toHaveTextContent(
                "/productos?categoria=herramientas|REPLACE",
            )
        })
        expect(screen.getByRole("heading", { name: "Taladro percutor 650W 13mm" })).toBeInTheDocument()
    })
})
