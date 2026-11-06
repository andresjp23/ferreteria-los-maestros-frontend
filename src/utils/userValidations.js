import { roles, userStatuses } from "./roles"

// Validaciones del formulario de usuario: las mismas reglas que aplica el backend (UsuarioRequest).
// Que el correo no esté repetido lo revisa el backend (responde 409).

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
// editing: al editar, la contraseña es opcional (vacía = se mantiene la actual).
// Devuelve el mensaje de error, o "" si el campo está bien.
export const validateField = (name, values, { editing = false } = {}) => {
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
            return ""
        }

        case "rol":
            if (!value) return "Selecciona un rol"
            if (!roles.includes(value)) return "Rol no válido"
            return ""

        case "estado":
            return userStatuses.includes(value) ? "" : "Selecciona un estado"

        case "password":
            if (!value) return editing ? "" : "La contraseña es obligatoria"
            if (value.length < 8 || value.length > 64) return "Debe tener entre 8 y 64 caracteres"
            if (/\s/.test(value)) return "No puede contener espacios"
            if (!/[a-z]/.test(value)) return "Debe incluir al menos una letra minúscula"
            if (!/[A-Z]/.test(value)) return "Debe incluir al menos una letra mayúscula"
            if (!/\d/.test(value)) return "Debe incluir al menos un número"
            return ""

        case "confirmPassword":
            // Al editar sin cambiar la contraseña, no hay nada que confirmar
            if (editing && !values.password) return ""
            if (!value) return "Confirma la contraseña"
            if (value !== values.password) return "Las contraseñas no coinciden"
            return ""

        default:
            return ""
    }
}

// Valida TODOS los campos. Devuelve un objeto solo con los que tienen error,
// por ejemplo { email: "El correo es obligatorio" }. Vacío = formulario válido.
export const validateUser = (values, options) => {
    const errors = {}

    for (const name of Object.keys(emptyUser)) {
        const error = validateField(name, values, options)
        if (error) errors[name] = error
    }

    return errors
}

// Convierte los valores del formulario en el cuerpo que espera el backend (POST/PUT /api/usuarios).
// La contraseña va tal cual (el backend la guarda con BCrypt). confirmPassword no se envía.
// Al editar, una contraseña vacía se manda como null: el backend mantiene la actual.
export const buildUser = (values) => ({
    // trim quita espacios de los bordes y el replace deja un solo espacio entre palabras
    nombre: values.nombre.trim().replace(/\s+/g, " "),
    email: values.email.trim().toLowerCase(),
    rol: values.rol,
    estado: values.estado,
    password: values.password || null,
})

// Un usuario del backend convertido en los valores del formulario, para editarlo
export const userToForm = (user) => ({
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    estado: user.estado,
    password: "",
    confirmPassword: "",
})
