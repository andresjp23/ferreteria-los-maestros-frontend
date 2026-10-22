import { Navigate, useLocation } from "react-router"
import useAuth from "../hooks/useAuth"
import { homeByRole } from "../utils/roles"
import LoginBrandPanel from "../components/auth/LoginBrandPanel"
import LoginForm from "../components/auth/LoginForm"

export default function Login() {
    const { user } = useAuth()
    const location = useLocation()

    // Si ya hay una sesión iniciada, no se muestra el login.
    // Vuelve a la página que se intentaba abrir (si ProtectedRoute la guardó) o a la de su rol.
    // Si esa página es de otro rol, ProtectedRoute lo redirige a la suya.
    // replace evita que el login quede en el historial del botón "atrás".
    if (user) {
        const from = location.state?.from
        const target = from ? `${from.pathname}${from.search ?? ""}` : homeByRole[user.rol]
        return <Navigate to={target} replace />
    }

    return (
        <>
            <title>Iniciar sesión | Ferretería Los Maestros</title>

            {/* Desde xl (1280px): dos columnas. Debajo de eso, solo el formulario. */}
            <main className="min-h-dvh bg-white xl:grid xl:grid-cols-2">
                <LoginBrandPanel />
                <LoginForm />
            </main>
        </>
    )
}
