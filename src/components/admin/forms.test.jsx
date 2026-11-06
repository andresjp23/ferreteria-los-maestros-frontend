import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CatalogContext } from "../../context/catalogContext"
import { brands, categories, units } from "../../test/fixtures"
import ProductForm from "./products/ProductForm"
import UserForm from "./users/UserForm"

// El formulario de producto lee categorías, marcas y unidades del catálogo
const renderProductForm = (props) =>
    render(
        <CatalogContext.Provider value={{ categories, brands, units }}>
            <ProductForm onCancel={vi.fn()} {...props} />
        </CatalogContext.Provider>,
    )

describe("formulario de producto", () => {
    it("muestra errores, enfoca el primer campo inválido y no envía datos incompletos", async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()

        renderProductForm({ onSubmit })

        await user.click(screen.getByRole("button", { name: "Agregar producto" }))

        expect(screen.getByText("El código es obligatorio")).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()
        expect(document.activeElement).toBe(screen.getByLabelText(/Código/i))
    })

    it("envía los valores cuando todos los campos requeridos son válidos", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined)
        const user = userEvent.setup()

        renderProductForm({ onSubmit })

        await user.type(screen.getByLabelText(/Código/i), "XZ999")
        await user.type(screen.getByLabelText(/Nombre del producto/i), "Taladro de prueba")
        await user.selectOptions(screen.getByRole("combobox", { name: /^Categoría/i }), "herramientas")
        await user.type(screen.getByLabelText(/Subcategoría/i), "Eléctricas")
        await user.type(screen.getByLabelText(/Marca/i), "Marca prueba")
        await user.selectOptions(screen.getByLabelText(/Unidad de venta/i), "Unidad")
        await user.type(screen.getByLabelText(/Precio de compra/i), "1000")
        await user.type(screen.getByLabelText(/Precio de venta/i), "1500")
        await user.type(screen.getByLabelText(/Stock inicial/i), "0")
        await user.type(screen.getByLabelText(/Stock mínimo/i), "0")
        await user.click(screen.getByRole("button", { name: "Agregar producto" }))

        expect(onSubmit).toHaveBeenCalledOnce()
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
            codigo: "XZ999",
            nombre: "Taladro de prueba",
            categoria: "herramientas",
            precioCompra: "1000",
            precioVenta: "1500",
            stock: "0",
            imagen: "",
        })
    })

    it("muestra en su campo el error que devuelve el backend (409 código repetido)", async () => {
        const onSubmit = vi.fn().mockResolvedValue({
            mensaje: "Ya existe un producto con este código",
            campos: { codigo: "Ya existe un producto con este código" },
        })
        const user = userEvent.setup()
        const initialValues = {
            codigo: "HE001",
            nombre: "Taladro",
            categoria: "herramientas",
            subcategoria: "Eléctricas",
            marca: "Bosch",
            unidad: "Unidad",
            precioCompra: "1000",
            precioVenta: "1500",
            stock: "5",
            stockMinimo: "1",
            descripcion: "",
            imagen: "",
        }

        renderProductForm({ onSubmit, initialValues })
        await user.click(screen.getByRole("button", { name: "Agregar producto" }))

        expect(await screen.findByText("Ya existe un producto con este código")).toBeInTheDocument()
        expect(screen.getByLabelText(/Código/i)).toHaveAttribute("aria-invalid", "true")
    })

    it("al editar, el código queda bloqueado y el botón dice Guardar cambios", () => {
        renderProductForm({ onSubmit: vi.fn(), editing: true })

        expect(screen.getByLabelText(/Código/i)).toBeDisabled()
        expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument()
    })
})

describe("formulario de usuario", () => {
    it("bloquea contraseñas distintas y envía al corregir la confirmación", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined)
        const user = userEvent.setup()

        render(<UserForm onCancel={vi.fn()} onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText(/Nombre completo/i), "Ana Pérez")
        await user.type(screen.getByLabelText(/Correo electrónico/i), "ana.nueva@example.cl")
        await user.selectOptions(screen.getByLabelText(/^Rol/i), "cliente")
        await user.type(screen.getByLabelText(/^Contraseña/i), "StrongPass1")
        await user.type(screen.getByLabelText(/Confirmar contraseña/i), "Different1")
        await user.click(screen.getByRole("button", { name: "Agregar usuario" }))

        expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()

        const confirmation = screen.getByLabelText(/Confirmar contraseña/i)
        await user.clear(confirmation)
        await user.type(confirmation, "StrongPass1")
        await user.click(screen.getByRole("button", { name: "Agregar usuario" }))

        expect(onSubmit).toHaveBeenCalledOnce()
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
            nombre: "Ana Pérez",
            email: "ana.nueva@example.cl",
            rol: "cliente",
            password: "StrongPass1",
            confirmPassword: "StrongPass1",
        })
    })
})
