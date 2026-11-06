import { api } from "./api"

// Cuentas de usuario (solo administrador)
export const getUsers = () => api.get("/usuarios")
export const createUser = (user) => api.post("/usuarios", user)
export const updateUser = (id, user) => api.put(`/usuarios/${id}`, user)
export const deleteUser = (id) => api.delete(`/usuarios/${id}`)
