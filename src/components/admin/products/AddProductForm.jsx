import { useRef, useState } from "react"
import { categories } from "../../../mocks/categories"
import { brands } from "../../../mocks/brands"
import { products } from "../../../mocks/products"
import { Field, SelectBox, inputClass } from "../FormField"
import {
    DESCRIPTION_MAX,
    emptyProduct,
    validateField,
    validateProduct,
} from "../../../utils/productValidation"

// Unidades disponibles: las que ya existen en el catálogo, sin repetir y ordenadas
const units = [...new Set(products.map((p) => p.unidad))].sort((a, b) => a.localeCompare(b, "es"))


export default function AddProductForm({ onCancel, onSubmit }) {
    // Lo que el usuario escribe y los errores de cada campo ({} = sin errores)
    const [values, setValues] = useState(emptyProduct)
    const [errors, setErrors] = useState({})

    // Referencia al input de archivo, para poder vaciarlo al quitar la imagen
    const fileInputRef = useRef(null)

    // Guarda el error de un campo, o lo borra si el mensaje viene vacío
    const setFieldError = (name, message) => {
        setErrors((prev) => {
            const next = { ...prev }
            if (message) next[name] = message
            else delete next[name]
            return next
        })
    }

    // Se ejecuta en cada tecla de los campos de texto y selects
    const handleChange = (event) => {
        const { name } = event.target

        // El código se escribe siempre en mayúsculas
        const value = name === "codigo" ? event.target.value.toUpperCase() : event.target.value

        const newValues = { ...values, [name]: value }
        setValues(newValues)

        // Si el campo ya tenía error, se revisa de nuevo mientras escribe:
        // así el mensaje desaparece apenas se corrige
        if (errors[name]) setFieldError(name, validateField(name, newValues))

        // El precio de venta depende del de compra: si ya tenía error, también se revisa
        if (name === "precioCompra" && errors.precioVenta) {
            setFieldError("precioVenta", validateField("precioVenta", newValues))
        }
    }

    // Al salir de un campo se revisa
    const handleBlur = (event) => {
        const { name } = event.target
        setFieldError(name, validateField(name, values))
    }

    // Archivo de imagen: no es un campo de texto, tiene su propio manejador
    const handleImageChange = (event) => {
        const file = event.target.files[0] ?? null
        const newValues = { ...values, imagen: file }

        setValues(newValues)
        setFieldError("imagen", validateField("imagen", newValues))
    }

    const handleRemoveImage = () => {
        setValues({ ...values, imagen: null })
        setFieldError("imagen", "")
        fileInputRef.current.value = "" // vacía el input para poder elegir el mismo archivo otra vez
    }

    // Al enviar: revisa TODOS los campos
    const handleSubmit = (event) => {
        event.preventDefault() // evita que el navegador recargue la página

        const newErrors = validateProduct(values)
        setErrors(newErrors)

        // Si hay errores, lleva el foco al primer campo con problema y no envía
        const firstInvalid = Object.keys(newErrors)[0]
        if (firstInvalid) {
            document.getElementById(`product-${firstInvalid}`)?.focus()
            return
        }

        onSubmit(values)
    }

    // Propiedades comunes de todos los campos controlados
    const fieldProps = (name) => ({
        id: `product-${name}`,
        name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur,
        // Avisa a los lectores de pantalla que el campo tiene error y dónde está el mensaje
        "aria-invalid": errors[name] ? true : undefined,
        "aria-describedby": errors[name] ? `product-${name}-error` : undefined,
        className: inputClass(errors[name]),
    })

    const errorCount = Object.keys(errors).length

    return (
        // noValidate: desactiva los mensajes del navegador, para mostrar solo los nuestros
        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            {/* Zona con scroll propio: el encabezado y los botones quedan siempre visibles */}
            <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
                <p className="mb-5 text-xs text-gray-500">
                    Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
                </p>

                <div className="grid gap-5 md:grid-cols-2">
                    <Field name="codigo" label="Código" required error={errors.codigo} hint="2 letras y 3 números. Ej.: MC001">
                        <input type="text" autoComplete="off" placeholder="MC001" data-autofocus {...fieldProps("codigo")} />
                    </Field>

                    <Field name="nombre" label="Nombre del producto" required error={errors.nombre}>
                        <input type="text" autoComplete="off" placeholder="Ej.: Cemento gris 25 kg" {...fieldProps("nombre")} />
                    </Field>

                    <Field name="categoria" label="Categoría" required error={errors.categoria}>
                        <SelectBox {...fieldProps("categoria")}>
                            <option value="">Selecciona una categoría</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </SelectBox>
                    </Field>

                    <Field name="subcategoria" label="Subcategoría" required error={errors.subcategoria}>
                        <input type="text" autoComplete="off" placeholder="Ej.: Cementos" {...fieldProps("subcategoria")} />
                    </Field>

                    <Field name="marca" label="Marca" required error={errors.marca}>
                        {/* list + datalist: sugiere las marcas existentes, pero permite escribir otra */}
                        <input type="text" autoComplete="off" list="brands-list" placeholder="Ej.: Stanley" {...fieldProps("marca")} />
                        <datalist id="brands-list">
                            {brands.map((brand) => (
                                <option key={brand} value={brand} />
                            ))}
                        </datalist>
                    </Field>

                    <Field name="unidad" label="Unidad de venta" required error={errors.unidad}>
                        <SelectBox {...fieldProps("unidad")}>
                            <option value="">Selecciona una unidad</option>
                            {units.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </SelectBox>
                    </Field>

                    {/* type="text" con inputMode="numeric": en el celular abre el teclado numérico,
                        pero así podemos mostrar nuestro propio mensaje si escriben letras */}
                    <Field name="precioCompra" label="Precio de compra ($)" required error={errors.precioCompra} hint="Número entero, sin puntos.">
                        <input type="text" inputMode="numeric" autoComplete="off" placeholder="Ej.: 3500" {...fieldProps("precioCompra")} />
                    </Field>

                    <Field name="precioVenta" label="Precio de venta ($)" required error={errors.precioVenta} hint="Número entero, sin puntos.">
                        <input type="text" inputMode="numeric" autoComplete="off" placeholder="Ej.: 4990" {...fieldProps("precioVenta")} />
                    </Field>

                    <Field name="stock" label="Stock inicial" required error={errors.stock}>
                        <input type="text" inputMode="numeric" autoComplete="off" placeholder="Ej.: 120" {...fieldProps("stock")} />
                    </Field>

                    <Field name="stockMinimo" label="Stock mínimo" required error={errors.stockMinimo}>
                        <input type="text" inputMode="numeric" autoComplete="off" placeholder="Ej.: 20" {...fieldProps("stockMinimo")} />
                    </Field>

                    <Field name="descripcion" label="Descripción" error={errors.descripcion} hint="Opcional." className="md:col-span-2">
                        <textarea rows={3} placeholder="Ej.: Cemento de alta resistencia." {...fieldProps("descripcion")} />
                        {/* Contador: se pone rojo si se pasa del máximo */}
                        <p
                            className={`mt-1 text-right text-xs ${
                                values.descripcion.length > DESCRIPTION_MAX ? "text-red-600" : "text-gray-500"
                            }`}
                        >
                            {values.descripcion.length}/{DESCRIPTION_MAX}
                        </p>
                    </Field>

                    {/* El input de archivo no se puede "controlar" con value, por eso va aparte */}
                    <Field name="imagen" label="Imagen" error={errors.imagen} hint="Opcional. JPG, PNG o WEBP, máximo 2 MB." className="md:col-span-2">
                        <input
                            ref={fileInputRef}
                            id="product-imagen"
                            name="imagen"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleImageChange}
                            aria-invalid={errors.imagen ? true : undefined}
                            aria-describedby={errors.imagen ? "product-imagen-error" : undefined}
                            className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary"
                        />

                        {values.imagen && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="mt-2 text-xs font-medium text-primary hover:opacity-80"
                            >
                                Quitar imagen
                            </button>
                        )}
                    </Field>
                </div>
            </div>

            {/* Botones */}
            <div className="border-t border-gray-200 px-5 py-4 md:px-6">
                {errorCount > 0 && (
                    <p role="alert" className="mb-3 text-sm text-red-600">
                        {errorCount === 1
                            ? "Revisa el campo con error."
                            : `Revisa los ${errorCount} campos con error.`}
                    </p>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Agregar producto
                    </button>
                </div>
            </div>
        </form>
    )
}