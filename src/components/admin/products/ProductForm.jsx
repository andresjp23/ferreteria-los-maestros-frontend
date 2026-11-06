import { useState } from "react"
import useCatalog from "../../../hooks/useCatalog"
import { Field, SelectBox } from "../FormField"
import { inputClass } from "../inputClass"
import { DESCRIPTION_MAX, emptyProduct, validateField, validateProduct } from "../../../utils/productValidation"

// Formulario para crear o editar un producto.
// initialValues: valores de partida (vacío para crear; los del producto para editar).
// editing: true al editar (el código no se puede cambiar).
// onSubmit(values): debe devolver una promesa. Si el backend rechaza los datos, la promesa entrega
// { mensaje, campos } y el formulario muestra cada error en su campo (ej. 409 en "codigo").
export default function ProductForm({ initialValues = emptyProduct, editing = false, onCancel, onSubmit }) {
    // Categorías, marcas y unidades vienen del backend (CatalogProvider)
    const { categories, brands, units } = useCatalog()

    // Lo que el usuario escribe y los errores de cada campo ({} = sin errores)
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})

    // Mientras se espera al backend, y el error general que devuelva (ej. sin conexión)
    const [submitting, setSubmitting] = useState(false)
    const [serverError, setServerError] = useState("")

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

    // Al enviar: revisa TODOS los campos y, si están bien, los manda al backend
    const handleSubmit = async (event) => {
        event.preventDefault() // evita que el navegador recargue la página
        setServerError("")

        const newErrors = validateProduct(values)
        setErrors(newErrors)

        // Si hay errores, lleva el foco al primer campo con problema y no envía
        const firstInvalid = Object.keys(newErrors)[0]
        if (firstInvalid) {
            document.getElementById(`product-${firstInvalid}`)?.focus()
            return
        }

        setSubmitting(true)
        const result = await onSubmit(values)

        // Sin resultado = todo salió bien (la página cierra el modal). Si no, se muestran los errores.
        if (result) {
            setErrors(result.campos ?? {})
            setServerError(Object.keys(result.campos ?? {}).length > 0 ? "" : result.mensaje)
            setSubmitting(false)
        }
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
                    <Field
                        name="codigo"
                        label="Código"
                        required
                        error={errors.codigo}
                        hint="2 letras y 3 números. Ej.: MC001"
                    >
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="MC001"
                            data-autofocus={editing ? undefined : true}
                            disabled={editing}
                            {...fieldProps("codigo")}
                            className={`${inputClass(errors.codigo)} disabled:bg-gray-100 disabled:text-gray-500`}
                        />
                    </Field>

                    <Field name="nombre" label="Nombre del producto" required error={errors.nombre}>
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="Ej.: Cemento gris 25 kg"
                            data-autofocus={editing ? true : undefined}
                            {...fieldProps("nombre")}
                        />
                    </Field>

                    <Field name="categoria" label="Categoría" required error={errors.categoria}>
                        <SelectBox {...fieldProps("categoria")}>
                            <option value="">Selecciona una categoría</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}
                                </option>
                            ))}
                        </SelectBox>
                    </Field>

                    <Field name="subcategoria" label="Subcategoría" required error={errors.subcategoria}>
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="Ej.: Cementos"
                            {...fieldProps("subcategoria")}
                        />
                    </Field>

                    <Field name="marca" label="Marca" required error={errors.marca}>
                        {/* list + datalist: sugiere las marcas existentes, pero permite escribir otra */}
                        <input
                            type="text"
                            autoComplete="off"
                            list="brands-list"
                            placeholder="Ej.: Stanley"
                            {...fieldProps("marca")}
                        />
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
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </SelectBox>
                    </Field>

                    {/* type="text" con inputMode="numeric": en el celular abre el teclado numérico,
                        pero así podemos mostrar nuestro propio mensaje si escriben letras */}
                    <Field
                        name="precioCompra"
                        label="Precio de compra ($)"
                        required
                        error={errors.precioCompra}
                        hint="Número entero, sin puntos."
                    >
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="Ej.: 3500"
                            {...fieldProps("precioCompra")}
                        />
                    </Field>

                    <Field
                        name="precioVenta"
                        label="Precio de venta ($)"
                        required
                        error={errors.precioVenta}
                        hint="Número entero, sin puntos."
                    >
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="Ej.: 4990"
                            {...fieldProps("precioVenta")}
                        />
                    </Field>

                    <Field name="stock" label="Stock inicial" required error={errors.stock}>
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="Ej.: 120"
                            {...fieldProps("stock")}
                        />
                    </Field>

                    <Field name="stockMinimo" label="Stock mínimo" required error={errors.stockMinimo}>
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="Ej.: 20"
                            {...fieldProps("stockMinimo")}
                        />
                    </Field>

                    <Field
                        name="descripcion"
                        label="Descripción"
                        error={errors.descripcion}
                        hint="Opcional."
                        className="md:col-span-2"
                    >
                        <textarea
                            rows={3}
                            placeholder="Ej.: Cemento de alta resistencia."
                            {...fieldProps("descripcion")}
                        />
                        {/* Contador: se pone rojo si se pasa del máximo */}
                        <p
                            className={`mt-1 text-right text-xs ${
                                values.descripcion.length > DESCRIPTION_MAX ? "text-red-600" : "text-gray-500"
                            }`}
                        >
                            {values.descripcion.length}/{DESCRIPTION_MAX}
                        </p>
                    </Field>

                    <Field
                        name="imagen"
                        label="Imagen"
                        error={errors.imagen}
                        hint="Opcional. Ruta de una imagen del sitio o una URL. Ej.: /products/taladro.webp"
                        className="md:col-span-2"
                    >
                        <input type="text" autoComplete="off" placeholder="/products/..." {...fieldProps("imagen")} />
                    </Field>
                </div>
            </div>

            {/* Botones */}
            <div className="border-t border-gray-200 px-5 py-4 md:px-6">
                {/* Error general del backend (por ejemplo, sin conexión) */}
                {serverError && (
                    <p role="alert" className="mb-3 text-sm text-red-600">
                        {serverError}
                    </p>
                )}

                {errorCount > 0 && (
                    <p role="alert" className="mb-3 text-sm text-red-600">
                        {errorCount === 1 ? "Revisa el campo con error." : `Revisa los ${errorCount} campos con error.`}
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
                        disabled={submitting}
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {submitting ? "Guardando..." : editing ? "Guardar cambios" : "Agregar producto"}
                    </button>
                </div>
            </div>
        </form>
    )
}
