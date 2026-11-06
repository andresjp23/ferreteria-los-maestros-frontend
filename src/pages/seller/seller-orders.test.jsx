import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { apiError, mockApi } from "../../test/mockApi"
import Orders from "./Orders"

const order = (id, estado) => ({
    id,
    cliente: "Camila Rojas",
    clienteEmail: "cliente@losmaestros.cl",
    fechaISO: new Date().toISOString(),
    estado,
    total: 11980,
    productos: ["Cemento Polpaico gris 25 kg"],
    detalle: [
        { codigo: "MC001", nombre: "Cemento Polpaico gris 25 kg", precioUnitario: 5990, cantidad: 2, subtotal: 11980 },
    ],
})

const renderOrders = () =>
    render(
        <MemoryRouter>
            <Orders />
        </MemoryRouter>,
    )

describe("panel del vendedor", () => {
    it("avanza el estado de un pedido al siguiente con el backend", async () => {
        let sent
        mockApi({
            "GET /pedidos": [order(16, "En preparación"), order(15, "Entregado")],
            "PATCH /pedidos/16/estado": ({ body }) => {
                sent = body
                return order(16, "Enviado")
            },
        })
        const user = userEvent.setup()
        renderOrders()

        const table = within(await screen.findByRole("table"))
        // Un pedido entregado ya no tiene siguiente estado
        expect(table.getByRole("button", { name: "Editar pedido 15" })).toBeDisabled()

        await user.click(table.getByRole("button", { name: "Editar pedido 16" }))
        const dialog = within(screen.getByRole("dialog", { name: "Cambiar estado" }))
        expect(dialog.getByText("2 × Cemento Polpaico gris 25 kg")).toBeInTheDocument()
        await user.click(dialog.getByRole("button", { name: 'Cambiar a "Enviado"' }))

        expect(await screen.findByText('El pedido #16 quedó "Enviado".')).toBeInTheDocument()
        expect(sent).toEqual({ estado: "Enviado" })
    })

    it("muestra el error del backend si el cambio no está permitido", async () => {
        mockApi({
            "GET /pedidos": [order(16, "En preparación")],
            "PATCH /pedidos/16/estado": apiError(400, "No tienes permisos para realizar esta acción"),
        })
        const user = userEvent.setup()
        renderOrders()

        const table = within(await screen.findByRole("table"))
        await user.click(table.getByRole("button", { name: "Marcar pedido 16 como enviado" }))

        expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permisos para realizar esta acción")
    })
})
