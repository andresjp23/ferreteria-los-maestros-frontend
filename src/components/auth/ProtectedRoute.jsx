import { Navigate, Outlet, useLocation } from "react-router"
import useAuth from "../../hooks/useAuth"
import { homeByRole } from "../../utils/roles"
import PageLoader from "../ui/PageLoader"

// Envuelve un grupo de rutas y decide si deja pasar.
// allowedRoles: lista de roles que pueden entrar, por ejemplo ["admin"]
// Ojo: esto solo decide qué se MUESTRA. Quien protege los datos es el backend, que revisa el token
// y el rol en cada petición (responde 401 o 403).
export default function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    // Todavía se está validando el token guardado: se espera antes de decidir
    if (loading) return <PageLoader />

    // Sin sesión, al login. Se guarda la página que intentaba abrir para volver después.
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    // Con sesión pero con un rol que no corresponde: lo devuelve a la página de su propio rol
    if (!allowedRoles.includes(user.rol)) {
        return <Navigate to={homeByRole[user.rol]} replace />
    }

    // Todo en orden: dibuja la ruta hija que corresponda (Outlet)
    return <Outlet />
}
