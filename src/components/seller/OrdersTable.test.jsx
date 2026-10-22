import { describe, expect, it, vi } from "vitest"
import { render, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import OrdersTable from "./OrdersTable"

const orders = [
    {
        id: 1042,
        cliente: "Carlos Rojas",
        fecha: "19 Oct, 10:24",
        estado: "En preparación",
        total: 89990,
        productos: ["Taladro de prueba"],
    },
    {
        id: 1041,
        cliente: "María González",
        fecha: "18 Oct, 16:32",
        estado: "Enviado",
        total: 24990,
        productos: ["Pintura de prueba"],
    },
]

describe("tarjetas de pedidos del vendedor", () => {
    it("conserva selección y acciones de pedido y deshabilita enviar para estados incompatibles", async () => {
        const user = userEvent.setup()
        const callbacks = {
            onToggle: vi.fn(),
            onToggleAll: vi.fn(),
            onPageChange: vi.fn(),
            onView: vi.fn(),
            onEdit: vi.fn(),
            onShip: vi.fn(),
        }

        const { container } = render(
            <OrdersTable
                orders={orders}
                selectedIds={[]}
                page={1}
                totalPages={1}
                total={2}
                start={1}
                end={2}
                {...callbacks}
            />,
        )

        const mobileView = within(container.querySelector('[class="xl:hidden"]'))
        const selectAll = mobileView.getByRole("checkbox", {
            name: "Seleccionar todos los pedidos de esta página",
        })
        await user.click(selectAll)
        expect(callbacks.onToggleAll).toHaveBeenCalledOnce()

        const orderCard = within(mobileView.getByRole("list", { name: "Pedidos" }))
        const firstOrder = orderCard.getAllByRole("listitem")[0]
        await user.click(within(firstOrder).getByRole("checkbox", { name: "Seleccionar pedido 1042" }))
        await user.click(within(firstOrder).getByRole("button", { name: "Ver pedido 1042" }))
        await user.click(within(firstOrder).getByRole("button", { name: "Editar pedido 1042" }))
        await user.click(within(firstOrder).getByRole("button", { name: "Marcar pedido 1042 como enviado" }))

        expect(callbacks.onToggle).toHaveBeenCalledWith(1042)
        expect(callbacks.onView).toHaveBeenCalledWith(orders[0])
        expect(callbacks.onEdit).toHaveBeenCalledWith(orders[0])
        expect(callbacks.onShip).toHaveBeenCalledWith(orders[0])
        expect(
            within(orderCard.getAllByRole("listitem")[1]).getByRole("button", {
                name: "Marcar pedido 1041 como enviado",
            }),
        ).toBeDisabled()
    })
})
