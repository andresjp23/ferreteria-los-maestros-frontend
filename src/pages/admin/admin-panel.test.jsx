import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { AuthProvider } from "../../context/AuthProvider"
import { CatalogProvider } from "../../context/CatalogProvider"
import { apiError, fakeToken, mockApi, reply } from "../../test/mockApi"
import { catalogRoutes, products, users } from "../../test/fixtures"
import AdminProducts from "./Products"
import AdminUsers from "./Users"
import Dashboard from "./Dashboard"

// Sesión de administrador + catálogo, como en la app real
const renderAdmin = (page) => {
    localStorage.setItem("auth_token", fakeToken())
    return render(
        <MemoryRouter>
            <AuthProvider>
                <CatalogProvider>{page}</CatalogProvider>
            </AuthProvider>
        </MemoryRouter>,
    )
}

// Productos del panel admin: lo mismo del catálogo más el precio de compra
const adminProducts = products.map((p) => ({ ...p, precioCompra: Math.round(p.precio * 0.7) }))

// La tabla de escritorio aparece cuando llegan los datos del backend
const desktopTable = async () => within(await screen.findByRole("table"))

describe("panel admin · productos", () => {
    it("edita un producto: abre el formulario con sus datos y envía el PUT al backend", async () => {
        let sent
        const fetchMock = mockApi({
            ...catalogRoutes,
            "GET /auth/me": users.admin,
            "GET /admin/productos": adminProducts,
            "PUT /admin/productos/HE001": ({ body }) => {
                sent = body
                return { ...adminProducts[0], stock: 20 }
            },
        })
        const user = userEvent.setup()
        renderAdmin(<AdminProducts />)

        await user.click((await desktopTable()).getByRole("button", { name: "Editar Taladro percutor 650W 13mm" }))

        const dialog = within(screen.getByRole("dialog", { name: "Editar producto" }))
        expect(dialog.getByLabelText(/Código/)).toHaveValue("HE001")
        await user.clear(dialog.getByLabelText(/Stock inicial/))
        await user.type(dialog.getByLabelText(/Stock inicial/), "20")
        await user.click(dialog.getByRole("button", { name: "Guardar cambios" }))

        expect(await screen.findByText('Se guardaron los cambios de "Taladro percutor 650W 13mm".')).toBeInTheDocument()
        expect(sent).toMatchObject({ codigo: "HE001", stock: 20, precioVenta: 79990 })
        // Después de guardar se vuelve a pedir la lista
        expect(fetchMock.mock.calls.filter(([url]) => url.endsWith("/admin/productos"))).toHaveLength(2)
    })

    it("elimina un producto después de confirmar", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true)
        const fetchMock = mockApi({
            ...catalogRoutes,
            "GET /auth/me": users.admin,
            "GET /admin/productos": adminProducts,
            "DELETE /admin/productos/MC001": reply(204),
        })
        const user = userEvent.setup()
        renderAdmin(<AdminProducts />)

        await user.click((await desktopTable()).getByRole("button", { name: "Eliminar Cemento Polpaico gris 25 kg" }))

        expect(await screen.findByText(/se eliminó del catálogo/)).toBeInTheDocument()
        expect(fetchMock.mock.calls.some(([, opts]) => opts?.method === "DELETE")).toBe(true)
    })
})

describe("panel admin · usuarios", () => {
    const userList = [
        { ...users.admin, estado: "Activo", ultimoAcceso: null },
        { ...users.cliente, estado: "Activo", ultimoAcceso: "2026-10-16T21:01:00" },
    ]

    it("no permite eliminar la propia cuenta y muestra el 409 si el usuario tiene pedidos", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true)
        mockApi({
            ...catalogRoutes,
            "GET /auth/me": users.admin,
            "GET /usuarios": userList,
            "DELETE /usuarios/3": apiError(409, "El usuario tiene pedidos. Desactívalo en vez de eliminarlo"),
        })
        const user = userEvent.setup()
        renderAdmin(<AdminUsers />)

        const table = await desktopTable()
        expect(table.getByRole("button", { name: "Eliminar a Administrador General" })).toBeDisabled()

        await user.click(table.getByRole("button", { name: "Eliminar a Camila Rojas" }))
        expect(await screen.findByRole("alert")).toHaveTextContent("El usuario tiene pedidos")
    })

    it("muestra en el formulario el correo repetido (409) que responde el backend", async () => {
        mockApi({
            ...catalogRoutes,
            "GET /auth/me": users.admin,
            "GET /usuarios": userList,
            "POST /usuarios": apiError(409, "Ya existe un usuario con este correo", {
                email: "Ya existe un usuario con este correo",
            }),
        })
        const user = userEvent.setup()
        renderAdmin(<AdminUsers />)

        await screen.findByRole("table")
        await user.click(screen.getByRole("button", { name: "Agregar usuario" }))
        const dialog = within(screen.getByRole("dialog", { name: "Agregar usuario" }))
        await user.type(dialog.getByLabelText(/Nombre completo/), "Camila Rojas")
        await user.type(dialog.getByLabelText(/Correo electrónico/), "cliente@losmaestros.cl")
        await user.selectOptions(dialog.getByLabelText(/^Rol/), "cliente")
        await user.type(dialog.getByLabelText(/^Contraseña/), "Segura2026")
        await user.type(dialog.getByLabelText(/Confirmar contraseña/), "Segura2026")
        await user.click(dialog.getByRole("button", { name: "Agregar usuario" }))

        expect(await dialog.findByText("Ya existe un usuario con este correo")).toBeInTheDocument()
    })
})

describe("panel admin · dashboard", () => {
    it("muestra los indicadores reales del backend con su variación", async () => {
        mockApi({
            ...catalogRoutes,
            "GET /auth/me": users.admin,
            "GET /admin/resumen": {
                productos: 76,
                productosBajoStock: 19,
                usuarios: 42,
                pedidosMes: 5,
                ventasMes: 119160,
                variacionPedidos: -28.6,
                variacionVentas: null,
            },
            "GET /pedidos": [],
        })
        renderAdmin(<Dashboard />)

        expect(await screen.findByText("76")).toBeInTheDocument()
        expect(screen.getByText("19 con stock bajo o sin stock")).toBeInTheDocument()
        expect(screen.getByText("$119.160")).toBeInTheDocument()
        expect(screen.getByText("-28,6%")).toBeInTheDocument()
        expect(screen.getByText("Aún no hay pedidos.")).toBeInTheDocument()
    })
})
