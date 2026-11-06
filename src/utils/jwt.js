// Lee la fecha de vencimiento (exp) de un JWT sin verificar la firma.
// La verificación real la hace el backend; aquí solo se usa para cerrar la sesión a tiempo.
// Devuelve el vencimiento en milisegundos, o null si el token no se puede leer.
export const getTokenExpiration = (token) => {
    try {
        // El JWT tiene 3 partes separadas por puntos; la del medio es el contenido en Base64URL
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        const { exp } = JSON.parse(atob(payload))
        return typeof exp === "number" ? exp * 1000 : null
    } catch {
        return null
    }
}
