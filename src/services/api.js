// Cliente HTTP único de la aplicación: todas las llamadas al backend pasan por aquí.
// Se encarga de la URL base, del formato JSON, de enviar el token y de convertir los errores
// del servidor ({ status, error, mensaje, campos }) en un ApiError fácil de usar en los componentes.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api"

// Nombre bajo el cual se guarda el JWT en el localStorage del navegador
const TOKEN_KEY = "auth_token"

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
}

// Error de la API con el código HTTP, el mensaje para mostrar y los errores por campo del formulario.
// status 0 = no hubo respuesta (el backend está apagado o no hay conexión).
export class ApiError extends Error {
    constructor(status, mensaje, campos = {}) {
        super(mensaje)
        this.name = "ApiError"
        this.status = status
        this.campos = campos
    }
}

// Función que se llama cuando el backend rechaza el token (401): la registra el AuthProvider
// para cerrar la sesión y avisar al usuario. Se guarda aquí para no importar React en este archivo.
let onUnauthorized = null
export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler
}

// Hace una petición y devuelve el JSON de la respuesta (o null si viene vacía, como en un 204).
async function request(path, { method = "GET", body } = {}) {
    const token = tokenStorage.get()
    const headers = { Accept: "application/json" }
    if (body !== undefined) headers["Content-Type"] = "application/json"
    if (token) headers.Authorization = `Bearer ${token}`

    let response
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        })
    } catch {
        // fetch solo falla así cuando no llega respuesta: servidor apagado, sin red o CORS bloqueado
        throw new ApiError(0, "No se pudo conectar con el servidor. Intenta nuevamente en unos minutos.")
    }

    // Algunas respuestas no traen cuerpo (204) o no son JSON: en ese caso data queda en null
    const data = response.status === 204 ? null : await response.json().catch(() => null)

    if (!response.ok) {
        const error = new ApiError(
            response.status,
            data?.mensaje ?? "Ocurrió un error inesperado. Intenta nuevamente.",
            data?.campos ?? {},
        )

        // Si había sesión y el backend respondió 401, el token venció o no es válido
        if (response.status === 401 && token) onUnauthorized?.(error.message)

        throw error
    }

    return data
}

export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body }),
    put: (path, body) => request(path, { method: "PUT", body }),
    patch: (path, body) => request(path, { method: "PATCH", body }),
    delete: (path) => request(path, { method: "DELETE" }),
}
