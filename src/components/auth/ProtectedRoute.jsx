import { Navigate, Outlet, useLocation } from "react-router"
import useAuth from "../../hooks/useAuth"
import { homeByRole } from "../../utils/roles"

// Envuelve un grupo de rutas y decide si deja pasar.
// allowedRoles: lista de roles que pueden entrar, por ejemplo ["admin"]
export default function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuth()
    const location = useLocation()

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
