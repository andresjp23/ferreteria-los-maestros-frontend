import { createContext, useContext, useEffect, useState } from "react"
import { users } from "../mocks/users"

// Nombre bajo el cual se guarda la sesión en el localStorage del navegador
const STORAGE_KEY = "auth_user"

// Crea el contexto (espacio compartido) de la sesión
const AuthContext = createContext()

// Lee la sesión guardada.
// Si no hay ninguna devuelve null, lo que significa que nadie ha iniciado sesion
const loadUser = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)

        // JSON.parse convierte el texto guardado de vuelta a un objeto de JavaScript
        return saved ? JSON.parse(saved) : null
    } catch {
        return null
    }
}

// Componente que envuelve la app y le entrega la sesión a todos sus hijos
export function AuthProvider({ children }) {
    // user: null si nadie inició sesión, o un objeto { id, nombre, email, rol }.
    // loadUser va sin paréntesis para que React la ejecute UNA sola vez, al crear el estado.
    const [user, setUser] = useState(loadUser)

    // Cada vez que user cambia, actualiza el localStorage:
    // si hay usuario lo guarda, y si es null (cerró sesión) borra lo guardado
    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [user])

    // Revisa el correo y la contraseña contra los usuarios mock.
    // Es async a propósito: en la fase 2 será una llamada al backend, que también tarda,
    // y así los componentes que la usan no tendrán que cambiar.
    const login = async (email, password) => {
        // find devuelve el primer usuario que cumple la condición, o undefined si ninguno la cumple.
        // El correo se limpia (espacios) y se pasa a minúsculas antes de comparar.
        const found = users.find(
            (u) => u.email === email.trim().toLowerCase() && u.password === password
        )

        // No hubo coincidencia: avisa del error y no inicia sesión
        if (!found) {
            return { ok: false, error: "Correo o contraseña incorrectos" }
        }

        // Se guarda una versión SIN la contraseña: la sesión nunca debe incluirla
        const safeUser = {
            id: found.id,
            nombre: found.nombre,
            email: found.email,
            rol: found.rol,
        }

        setUser(safeUser)

        return { ok: true, user: safeUser }
    }

    // Cerrar sesión: deja user en null (el useEffect de arriba borra el localStorage)
    const logout = () => {
        setUser(null)
    }

    return (
        // value: lo que queda disponible para los componentes que usen el contexto
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook propio: atajo para acceder a la sesión desde cualquier componente
// Uso:  const { user, login, logout } = useAuth()
export function useAuth() {
    return useContext(AuthContext)
}