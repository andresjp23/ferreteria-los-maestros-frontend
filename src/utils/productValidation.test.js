import { describe, expect, it } from "vitest"
import { validateField, validateProduct } from "./productValidation"

const validProduct = {
    codigo: "XZ999",
    nombre: "Taladro de prueba",
    categoria: "herramientas",
    subcategoria: "Eléctricas",
    marca: "Marca prueba",
    unidad: "Unidad",
    precioCompra: "1000",
    precioVenta: "1500",
    stock: "0",
    stockMinimo: "0",
    descripcion: "",
    imagen: "",
}

describe("validación de productos", () => {
    it("valida el formato y los valores permitidos del producto (la unicidad la revisa el backend)", () => {
        expect(validateField("codigo", { ...validProduct, codigo: "xz999" })).toMatch(/Formato inválido/)
        expect(validateField("codigo", validProduct)).toBe("")
        expect(validateField("categoria", { ...validProduct, categoria: "" })).toBe("Selecciona una categoría")
        expect(validateField("stock", validProduct)).toBe("")
        expect(validateField("stock", { ...validProduct, stock: "100001" })).toMatch(/No puede superar/)
    })

    it("impide vender bajo el costo y acepta solo rutas o URLs como imagen", () => {
        expect(validateField("precioVenta", { ...validProduct, precioVenta: "999" })).toBe(
            "No puede ser menor al precio de compra",
        )
        expect(validateField("precioVenta", validProduct)).toBe("")

        expect(validateField("imagen", { ...validProduct, imagen: "/products/taladro.webp" })).toBe("")
        expect(validateField("imagen", { ...validProduct, imagen: "https://ejemplo.cl/a.png" })).toBe("")
        expect(validateField("imagen", { ...validProduct, imagen: "taladro.webp" })).toMatch(/ruta que empiece/)
    })

    it("devuelve un objeto vacío para un producto completo y válido", () => {
        expect(validateProduct(validProduct)).toEqual({})
    })
})
