import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes, useLocation, useNavigationType } from "react-router"
import { CatalogProvider } from "../context/CatalogProvider"
import { CartProvider } from "../context/CartProvider"
import { mockApi, apiError } from "../test/mockApi"
import { catalogRoutes } from "../test/fixtures"
import Products from "./Products"

function RouterState() {
    const location = useLocation()
    const navigationType = useNavigationType()

    return (
        <output data-testid="router-state">
            {location.pathname}
            {location.search}|{navigationType}
        </output>
    )
}

const renderCatalog = (entry = "/productos") =>
    render(
        <MemoryRouter initialEntries={[entry]}>
            <CatalogProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/productos" element={<Products />} />
                    </Routes>
                    <RouterState />
                </CartProvider>
            </CatalogProvider>
        </MemoryRouter>,
    )

describe("catálogo", () => {
    it("muestra los productos que entrega el backend", async () => {
        mockApi(catalogRoutes)
        renderCatalog()

        expect(screen.getByText("Cargando productos...")).toBeInTheDocument()
        expect(await screen.findByRole("heading", { name: "Cemento Polpaico gris 25 kg" })).toBeInTheDocument()
        expect(screen.getByText("Mostrando 3 de 3 productos")).toBeInTheDocument()
        // Categorías y marcas de los filtros también vienen del backend
        expect(screen.getByLabelText("Materiales de construcción")).toBeInTheDocument()
        expect(screen.getByLabelText("Makita")).toBeInTheDocument()
    })

    it("filtra al escribir, reemplaza la URL y conserva otros parámetros al limpiar", async () => {
        mockApi(catalogRoutes)
        const user = userEvent.setup()
        renderCatalog("/productos?categoria=herramientas")

        await screen.findByText("Mostrando 2 de 2 productos")
        const search = screen.getByRole("searchbox", { name: "Buscar productos" })
        await user.type(search, "taladro")

        expect(await screen.findByRole("heading", { name: "Taladro percutor 650W 13mm" })).toBeInTheDocument()
        expect(screen.getByText("Mostrando 1 de 1 producto")).toBeInTheDocument()
        expect(screen.getByTestId("router-state")).toHaveTextContent(
            "/productos?categoria=herramientas&q=taladro|REPLACE",
        )

        await user.clear(search)
        await waitFor(() => {
            expect(screen.getByTestId("router-state")).toHaveTextContent("/productos?categoria=herramientas|REPLACE")
        })
        expect(screen.getByRole("heading", { name: "Taladro percutor 650W 13mm" })).toBeInTheDocument()
    })

    it("muestra el error y permite reintentar si el backend falla", async () => {
        mockApi({ ...catalogRoutes, "GET /productos": apiError(500, "Ocurrió un error inesperado") })
        const user = userEvent.setup()
        renderCatalog()

        expect(await screen.findByRole("alert")).toHaveTextContent("Ocurrió un error inesperado")

        mockApi(catalogRoutes)
        await user.click(screen.getByRole("button", { name: "Reintentar" }))
        expect(await screen.findByText("Mostrando 3 de 3 productos")).toBeInTheDocument()
    })
})
