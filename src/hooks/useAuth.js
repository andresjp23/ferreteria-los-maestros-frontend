import { useContext } from "react"
import { AuthContext } from "../context/authContext"

// Hook propio: atajo para acceder a la sesión desde cualquier componente
// Uso:  const { user, login, logout } = useAuth()
export default function useAuth() {
    const context = useContext(AuthContext)

    // Si se usa fuera del provider, avisa con un error claro en vez de fallar más adelante
    if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>")

    return context
}
