import { Navigate, Outlet } from "react-router";
import {useAuth} from "../../context/AuthContext";
import {homeByRole} from "../../utils/roles";

// envuelve un grupo de rutas y decide si deja pasar
// allowedRoles: Lista de rolas que pueden entrar, por ejemplo "admdin"
export default function ProtectedRoute({allowedRoles}){
    const {user} = useAuth()

    // Sin sesion, al login
    if (!user){
        return <Navigate to="/login" replace />
    }
    
    // Con sesión pero con un rol que no corresponde: lo devuelve a la página de su propio rol
    if (!allowedRoles.includes(user.rol)) {
        return <Navigate to={homeByRole[user.rol]} replace />
    }

    // Todo en orden: dibuja la ruta hija que corresponda (Outlet)
    return <Outlet />
}