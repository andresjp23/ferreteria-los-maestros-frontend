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
    imagen: null,
}

describe("validación de productos", () => {
    it("valida el formato, unicidad y valores permitidos del producto", () => {
        expect(validateField("codigo", { ...validProduct, codigo: "xz999" })).toMatch(/Formato inválido/)
        expect(validateField("codigo", { ...validProduct, codigo: "MC001" })).toMatch(/Ya existe/)
        expect(validateField("codigo", validProduct)).toBe("")
        expect(validateField("categoria", { ...validProduct, categoria: "inexistente" })).toBe("Categoría no válida")
        expect(validateField("stock", validProduct)).toBe("")
        expect(validateField("stock", { ...validProduct, stock: "100001" })).toMatch(/No puede superar/)
    })

    it("impide vender bajo el costo y rechaza imágenes no permitidas o demasiado grandes", () => {
        expect(validateField("precioVenta", { ...validProduct, precioVenta: "999" })).toBe(
            "No puede ser menor al precio de compra",
        )
        expect(validateField("precioVenta", validProduct)).toBe("")

        const gif = new File(["imagen"], "imagen.gif", { type: "image/gif" })
        expect(validateField("imagen", { ...validProduct, imagen: gif })).toMatch(/Formato no permitido/)

        const largeImage = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "imagen.png", {
            type: "image/png",
        })
        expect(validateField("imagen", { ...validProduct, imagen: largeImage })).toMatch(/más de 2 MB/)
    })

    it("devuelve un objeto vacío para un producto completo y válido", () => {
        expect(validateProduct(validProduct)).toEqual({})
    })
})
