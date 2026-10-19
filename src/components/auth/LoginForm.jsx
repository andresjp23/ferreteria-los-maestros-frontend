import { useState } from "react"
import { Link } from "react-router"
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { users } from "../../mocks/users"
import Logo from "../../assets/logo.png"

// Campo del formulario: etiqueta + caja con ícono + input.
// "action" es un espacio opcional a la derecha (por ejemplo, el ojo de la contraseña).
// ...inputProps recibe todo lo demás (type, value, onChange, placeholder...) y se lo pasa al input.
function AuthField({ id, label, icon: Icon, action, ...inputProps }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium text-secondary">
                {label}
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                <Icon className="size-5 shrink-0 text-secondary" />

                <input
                    id={id}
                    className="w-full bg-transparent py-3 text-sm text-secondary outline-none placeholder:text-slate-400 md:text-base"
                    {...inputProps}
                />

                {action}
            </div>
        </div>
    )
}

export default function LoginForm() {
    const { login } = useAuth()

    // Lo que escribe el usuario
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Mensaje de error ("" = sin error) y si se está enviando el formulario
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    // Se ejecuta al enviar el formulario (botón o tecla Enter)
    const handleSubmit = async (event) => {
        event.preventDefault() // evita que el navegador recargue la página
        setError("")

        // Validación mínima: ambos campos con contenido
        if (!email.trim() || !password) {
            setError("Ingresa tu correo y tu contraseña")
            return
        }

        setSubmitting(true)

        // await espera la respuesta de login (hoy instantánea; en la fase 2 vendrá del backend)
        const result = await login(email, password)

        // Si falló, muestra el error y reactiva el botón.
        // Si salió bien no hay que hacer nada acá: la sesión queda en el contexto
        // y la página Login redirige sola según el rol.
        if (!result.ok) {
            setError(result.error)
            setSubmitting(false)
        }
    }

    return (
        <section className="relative flex min-h-dvh items-center justify-center px-6 py-16 md:px-10 xl:px-20">
            {/* Volver: solo en móvil y tablet (en escritorio está sobre la imagen) */}
            <Link
                to="/"
                className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary md:left-10 xl:hidden"
            >
                <ArrowLeft className="size-4" />
                Volver
            </Link>

            <div className="w-full max-w-md">
                {/* Marca compacta: solo en móvil y tablet */}
                <div className="mb-8 flex items-center gap-3 xl:hidden">
                    <img
                        src={Logo}
                        alt="Logo Ferretería Los Maestros"
                        className="w-12 object-contain"
                    />
                    <div className="text-base font-extrabold uppercase leading-tight">
                        <p className="text-secondary">Ferretería</p>
                        <p className="text-primary">Los Maestros</p>
                    </div>
                </div>

                {/* Título */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold leading-tight text-secondary md:text-3xl xl:text-4xl">
                        Inicia sesión en tu
                        <span className="block text-primary">cuenta</span>
                    </h1>

                    <p className="mt-3 text-sm text-slate-500 md:text-base">
                        Accede a tu cuenta de Ferretería Los Maestros.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <AuthField
                        id="email"
                        label="Correo electrónico"
                        icon={Mail}
                        type="email"
                        autoComplete="email"
                        placeholder="tucorreo@ejemplo.cl"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <AuthField
                        id="password"
                        label="Contraseña"
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        action={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className="shrink-0 text-slate-500 transition-colors hover:text-secondary"
                            >
                                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                        }
                    />

                    {/* Mensaje de error: solo se dibuja si hay texto */}
                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Ingresando..." : "Iniciar sesión"}
                        {!submitting && <ArrowRight className="size-5" />}
                    </button>
                </form>

                {/* Cuentas de prueba. Se retira en producción. */}
                <details className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-secondary">
                        Cuentas de prueba para evaluación
                    </summary>

                    <ul className="mt-3 space-y-2 text-xs text-slate-600">
                        {users.map((u) => (
                            <li key={u.id} className="wrap-break-word">
                                <span className="font-semibold capitalize text-secondary">{u.rol}:</span>{" "}
                                {u.email} / {u.password}
                            </li>
                        ))}
                    </ul>
                </details>
            </div>
        </section>
    )
}