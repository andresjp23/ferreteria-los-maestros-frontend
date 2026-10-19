import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { homeByRole } from "../utils/roles"
import LoginBrandPanel from "../components/auth/LoginBrandPanel"
import LoginForm from "../components/auth/LoginForm"

export default function Login() {
    const { user } = useAuth()

    // Si ya hay una sesión iniciada, no se muestra el login: va a la página de su rol.
    // replace evita que el login quede en el historial del botón "atrás".
    if (user) {
        return <Navigate to={homeByRole[user.rol]} replace />
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