import { createContext } from "react"

// Espacio compartido de la sesión. Lo llena AuthProvider y se lee con el hook useAuth.
export const AuthContext = createContext(null)
