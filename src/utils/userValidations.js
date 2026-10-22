import { adminUsers } from "../mocks/adminUsers"
import { roles, userStatuses } from "./roles"

// Valores iniciales del formulario. El ORDEN de estas claves es el orden en que
// se validan los campos (tiene que coincidir con el orden en que aparecen en pantalla).
export const emptyUser = {
    nombre: "",
    email: "",
    rol: "",
    estado: "Activo", // viene preseleccionado
    password: "",
    confirmPassword: "",
}

// Valida UN campo. Recibe todos los valores porque una regla (confirmar contraseña)
// necesita mirar otro campo (la contraseña).
// Devuelve el mensaje de error, o "" si el campo está bien.
export const validateField = (name, values) => {
    // Las contraseñas se revisan tal cual (los espacios cuentan como error).
    // Los demás textos se revisan sin espacios al inicio ni al final.
    const isPassword = name === "password" || name === "confirmPassword"
    const value = isPassword ? values[name] : values[name].trim()

    switch (name) {
        case "nombre":
            if (!value) return "El nombre es obligatorio"
            if (value.length < 3 || value.length > 60) return "Debe tener entre 3 y 60 caracteres"
            // \p{L} = cualquier letra (con tildes y ñ). Se permiten espacios, apóstrofes y guiones.
            if (!/^\p{L}[\p{L} '-]*$/u.test(value)) return "Solo letras, espacios, apóstrofes y guiones"
            // Nombre y apellido: al menos dos palabras
            if (value.split(/\s+/).length < 2) return "Ingresa nombre y apellido"
            return ""

        case "email": {
            // Los correos se comparan siempre en minúsculas
            const email = value.toLowerCase()

            if (!email) return "El correo es obligatorio"
            if (email.length > 80) return "No puede superar los 80 caracteres"
            // Formato: usuario@dominio.ext (sin espacios, un solo @ y una extensión de 2 o más letras)
            if (!/^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(email)) {
                return "Ingresa un correo válido (ej. nombre@dominio.cl)"
            }
            // Único: no puede repetirse uno que ya existe
            if (adminUsers.some((u) => u.email === email)) return "Ya existe un usuario con este correo"
            return ""
        }

        case "rol":
            if (!value) return "Selecciona un rol"
            if (!roles.includes(value)) return "Rol no válido"
            return ""

        case "estado":
            return userStatuses.includes(value) ? "" : "Selecciona un estado"

        case "password":
            if (!value) return "La contraseña es obligatoria"
            if (value.length < 8 || value.length > 64) return "Debe tener entre 8 y 64 caracteres"
            if (/\s/.test(value)) return "No puede contener espacios"
            if (!/[a-z]/.test(value)) return "Debe incluir al menos una letra minúscula"
            if (!/[A-Z]/.test(value)) return "Debe incluir al menos una letra mayúscula"
            if (!/\d/.test(value)) return "Debe incluir al menos un número"
            return ""

        case "confirmPassword":
            if (!value) return "Confirma la contraseña"
            if (value !== values.password) return "Las contraseñas no coinciden"
            return ""

        default:
            return ""
    }
}

// Valida TODOS los campos. Devuelve un objeto solo con los que tienen error,
// por ejemplo { email: "El correo es obligatorio" }. Vacío = formulario válido.
export const validateUser = (values) => {
    const errors = {}

    for (const name of Object.keys(emptyUser)) {
        const error = validateField(name, values)
        if (error) errors[name] = error
    }

    return errors
}

// Convierte los valores del formulario en el usuario con sus datos limpios.
// La contraseña NO se incluye: en la fase 2 se envía al backend aparte, por HTTPS.
export const buildUser = (values) => ({
    // trim quita espacios de los bordes y el replace deja un solo espacio entre palabras
    nombre: values.nombre.trim().replace(/\s+/g, " "),
    email: values.email.trim().toLowerCase(),
    rol: values.rol,
    estado: values.estado,
})
