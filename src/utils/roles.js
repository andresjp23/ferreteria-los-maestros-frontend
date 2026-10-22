// Roles del sistema, en el orden en que se muestran en los selectores
export const roles = ["admin", "vendedor", "cliente"]

// Estados posibles de una cuenta de usuario
export const userStatuses = ["Activo", "Inactivo"]

// Se define la pagina de inicio para cada rol
export const homeByRole = {
    cliente: "/",
    vendedor: "/vendedor",
    admin: "/admin",
}

// Nombre visible de cada rol
export const roleLabels = {
    cliente: "Cliente",
    vendedor: "Vendedor",
    admin: "Administrador",
}
