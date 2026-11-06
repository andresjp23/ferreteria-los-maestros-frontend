// Validaciones del formulario de producto. Son las mismas reglas que aplica el backend
// (ProductoRequest): aquí sirven para avisar al instante, sin esperar la respuesta del servidor.
// Lo que solo el backend puede saber (código repetido, categoría inexistente) llega como error 400/409.

// Límites de las reglas: se ajustan acá, en un solo lugar
const MAX_PRICE = 9999999
const MAX_STOCK = 100000
const IMAGE_MAX = 255
export const DESCRIPTION_MAX = 120

// Valores iniciales del formulario. El ORDEN de estas claves es el orden en que
// se validan los campos (tiene que coincidir con el orden en que aparecen en pantalla).
export const emptyProduct = {
    codigo: "",
    nombre: "",
    categoria: "",
    subcategoria: "",
    marca: "",
    unidad: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    stockMinimo: "",
    descripcion: "",
    imagen: "",
}

// Valida un número entero escrito como texto.
// Devuelve el mensaje de error, o "" si está bien.
const validateInteger = (text, { requiredMessage, max, allowZero }) => {
    // Vacío
    if (text === "") return requiredMessage

    // Tipo de dato: solo dígitos (sin letras, signo menos, puntos, comas ni espacios)
    if (!/^\d+$/.test(text)) return "Ingresa solo números enteros, sin puntos, comas ni símbolos"

    const number = Number(text)

    // Rango
    if (!allowZero && number === 0) return "Debe ser mayor a 0"
    if (number > max) return `No puede superar ${max.toLocaleString("es-CL")}`

    return ""
}

// Valida UN campo. Recibe todos los valores porque una regla (precio de venta)
// necesita mirar otro campo (precio de compra).
// Devuelve el mensaje de error, o "" si el campo está bien.
export const validateField = (name, values) => {
    // Los textos se revisan sin espacios al inicio ni al final
    const value = typeof values[name] === "string" ? values[name].trim() : values[name]

    switch (name) {
        case "codigo":
            if (!value) return "El código es obligatorio"
            // Formato: 2 letras mayúsculas + 3 números (como MC001, HE004)
            if (!/^[A-Z]{2}\d{3}$/.test(value)) return "Formato inválido: 2 letras mayúsculas y 3 números (ej. MC001)"
            // Que no esté repetido lo revisa el backend (responde 409)
            return ""

        case "nombre":
            if (!value) return "El nombre es obligatorio"
            if (value.length < 3 || value.length > 80) return "Debe tener entre 3 y 80 caracteres"
            // \p{L} = cualquier letra (con tildes y ñ). Evita nombres como "12345"
            if (!/\p{L}/u.test(value)) return "Debe incluir al menos una letra"
            return ""

        case "categoria":
            return value ? "" : "Selecciona una categoría"

        case "subcategoria":
            if (!value) return "La subcategoría es obligatoria"
            if (value.length < 2 || value.length > 40) return "Debe tener entre 2 y 40 caracteres"
            if (!/\p{L}/u.test(value)) return "Debe incluir al menos una letra"
            return ""

        case "marca":
            if (!value) return "La marca es obligatoria"
            if (value.length < 2 || value.length > 30) return "Debe tener entre 2 y 30 caracteres"
            // Letras, números, espacio y los símbolos . + & ' - (para marcas como "3M" o "Black+Decker")
            if (!/^[\p{L}\d .+&'-]+$/u.test(value)) return "Solo letras, números y los símbolos . + & ' -"
            return ""

        case "unidad":
            return value ? "" : "Selecciona una unidad"

        case "precioCompra":
            return validateInteger(value, {
                requiredMessage: "El precio de compra es obligatorio",
                max: MAX_PRICE,
                allowZero: false,
            })

        case "precioVenta": {
            const error = validateInteger(value, {
                requiredMessage: "El precio de venta es obligatorio",
                max: MAX_PRICE,
                allowZero: false,
            })
            if (error) return error

            // Regla entre campos: no se puede vender bajo el costo.
            // Solo se revisa si el precio de compra es un número válido.
            const cost = String(values.precioCompra).trim()
            if (/^\d+$/.test(cost) && Number(value) < Number(cost)) {
                return "No puede ser menor al precio de compra"
            }
            return ""
        }

        case "stock":
            return validateInteger(value, {
                requiredMessage: "El stock es obligatorio",
                max: MAX_STOCK,
                allowZero: true, // 0 es un stock válido
            })

        case "stockMinimo":
            return validateInteger(value, {
                requiredMessage: "El stock mínimo es obligatorio",
                max: MAX_STOCK,
                allowZero: true,
            })

        case "descripcion":
            // Opcional: solo se revisa el largo
            return value.length > DESCRIPTION_MAX ? `Máximo ${DESCRIPTION_MAX} caracteres` : ""

        case "imagen":
            // Opcional: ruta de una imagen del sitio (/products/...) o una URL completa
            if (!value) return ""
            if (value.length > IMAGE_MAX) return `Máximo ${IMAGE_MAX} caracteres`
            if (!/^(\/|https?:\/\/)\S+$/.test(value)) return "Usa una ruta que empiece con / o una URL (https://...)"
            return ""

        default:
            return ""
    }
}

// Valida TODOS los campos. Devuelve un objeto solo con los que tienen error,
// por ejemplo { codigo: "El código es obligatorio" }. Vacío = formulario válido.
export const validateProduct = (values) => {
    const errors = {}

    for (const name of Object.keys(emptyProduct)) {
        const error = validateField(name, values)
        if (error) errors[name] = error
    }

    return errors
}

// Convierte los valores del formulario (todo texto) en el cuerpo que espera el backend
// (POST/PUT /api/admin/productos): textos sin espacios sobrantes y números como número.
export const buildProduct = (values) => ({
    codigo: values.codigo.trim(),
    nombre: values.nombre.trim(),
    categoria: values.categoria,
    subcategoria: values.subcategoria.trim(),
    marca: values.marca.trim(),
    unidad: values.unidad,
    precioCompra: Number(values.precioCompra),
    precioVenta: Number(values.precioVenta),
    stock: Number(values.stock),
    stockMinimo: Number(values.stockMinimo),
    descripcion: values.descripcion.trim(),
    imagen: values.imagen.trim() || null,
})

// Lo inverso: un producto del backend convertido en los valores (texto) del formulario, para editarlo
export const productToForm = (product) => ({
    codigo: product.id,
    nombre: product.nombre,
    categoria: product.categoria,
    subcategoria: product.subcategoria,
    marca: product.marca,
    unidad: product.unidad,
    precioCompra: String(product.precioCompra),
    precioVenta: String(product.precio),
    stock: String(product.stock),
    stockMinimo: String(product.stockMinimo),
    descripcion: product.descripcion ?? "",
    imagen: product.image ?? "",
})
