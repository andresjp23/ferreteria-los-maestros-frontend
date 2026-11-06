import { api } from "./api"

// Inicia sesión. Responde { token, expiraEn, usuario: { id, nombre, email, rol } }
export const login = (email, password) => api.post("/auth/login", { email, password })

// Usuario dueño del token guardado: se usa al recargar la página para restaurar la sesión
export const getCurrentUser = () => api.get("/auth/me")
