import { useCallback, useEffect, useState } from "react"
import * as authService from "../services/authService"
import { setUnauthorizedHandler, tokenStorage } from "../services/api"
import { getTokenExpiration } from "../utils/jwt"
import { AuthContext } from "./authContext"

const EXPIRED_MESSAGE = "Tu sesión expiró. Inicia sesión nuevamente"

// Revisa el token guardado al abrir la app. Un token vencido no se envía al backend: se descarta.
const readStoredSession = () => {
    const token = tokenStorage.get()
    if (!token) return { token: null, message: "" }

    const expiration = getTokenExpiration(token)
    if (expiration !== null && expiration <= Date.now()) {
        tokenStorage.clear()
        return { token: null, message: EXPIRED_MESSAGE }
    }
    return { token, message: "" }
}

// Componente que envuelve la app y le entrega la sesión a todos sus hijos.
// La sesión es el JWT guardado en localStorage: el usuario se pide al backend (GET /auth/me),
// así el rol siempre viene del servidor y no de algo que se pueda editar en el navegador.
export function AuthProvider({ children }) {
    // Sesión guardada al abrir la app. La función va sin paréntesis para que React la ejecute UNA vez.
    const [storedSession] = useState(readStoredSession)

    // user: null si nadie inició sesión, o { id, nombre, email, rol }
    const [user, setUser] = useState(null)

    // loading: true mientras el backend confirma el token guardado (al abrir o recargar la página).
    // Mientras dura, ProtectedRoute espera en vez de mandar al login antes de tiempo.
    const [loading, setLoading] = useState(storedSession.token !== null)

    // Aviso para la página de login (por ejemplo, "Tu sesión expiró")
    const [sessionMessage, setSessionMessage] = useState(storedSession.message)

    // Cerrar sesión: borra el token y el usuario. message es opcional y se muestra en el login.
    const logout = useCallback((message = "") => {
        tokenStorage.clear()
        setUser(null)
        setSessionMessage(message)
    }, [])

    // Si el backend responde 401 a una petición con token (venció o es inválido), se cierra la sesión
    useEffect(() => {
        setUnauthorizedHandler((message) => logout(message || EXPIRED_MESSAGE))
        return () => setUnauthorizedHandler(null)
    }, [logout])

    // Al abrir la app: si hay un token vigente guardado, se valida con el backend y se recupera el usuario
    useEffect(() => {
        if (!storedSession.token) return

        let cancelled = false
        authService
            .getCurrentUser()
            .then((currentUser) => {
                if (!cancelled) setUser(currentUser)
            })
            .catch(() => {
                // 401: el handler de arriba ya cerró la sesión. Otro error (servidor apagado):
                // no se puede confirmar la sesión, así que se descarta el token.
                if (!cancelled && tokenStorage.get()) logout()
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        // Si el componente se desmonta antes de la respuesta, no se actualiza el estado
        return () => {
            cancelled = true
        }
    }, [storedSession, logout])

    // Mientras haya sesión, programa el cierre automático para el momento en que vence el token
    useEffect(() => {
        if (!user) return
        const expiration = getTokenExpiration(tokenStorage.get())
        if (expiration === null) return

        const timer = setTimeout(() => logout(EXPIRED_MESSAGE), Math.max(0, expiration - Date.now()))
        return () => clearTimeout(timer)
    }, [user, logout])

    // Inicia sesión contra el backend. Devuelve { ok: true, user } o { ok: false, error }
    // para que el formulario muestre el mensaje sin manejar excepciones.
    const login = async (email, password) => {
        try {
            const { token, usuario } = await authService.login(email.trim(), password)
            tokenStorage.set(token)
            setSessionMessage("")
            setUser(usuario)
            return { ok: true, user: usuario }
        } catch (error) {
            return { ok: false, error: error.message }
        }
    }

    const clearSessionMessage = () => setSessionMessage("")

    return (
        // value: lo que queda disponible para los componentes que usen el contexto
        <AuthContext.Provider value={{ user, loading, login, logout, sessionMessage, clearSessionMessage }}>
            {children}
        </AuthContext.Provider>
    )
}
