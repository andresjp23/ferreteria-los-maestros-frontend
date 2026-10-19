import { Link } from "react-router"
import { ArrowLeft } from "lucide-react"
import Logo from "../../assets/logo.png"

export default function LoginBrandPanel() {
    return (
        // hidden: solo se ve desde xl (1280px)
        <section className="relative hidden min-h-dvh overflow-hidden bg-secondary xl:block">
            {/* Imagen de fondo (está en public/login) */}
            <img
                src="/login/login-image.png"
                alt="Casco de seguridad y herramientas en una ferretería"
                className="absolute inset-0 size-full object-cover"
            />

            {/* Capa oscura para que el texto se lea */}
            <div className="absolute inset-0 bg-linear-to-b from-secondary/80 via-secondary/35 to-secondary/20" />

            {/* Botón volver: z-20 para quedar ENCIMA del contenedor de la marca (z-10),
                que ocupa todo el panel y se llevaba los clics */}
            <Link
                to="/"
                className="absolute left-8 top-8 z-20 inline-flex items-center gap-2 rounded-lg bg-secondary/70 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-secondary"
            >
                <ArrowLeft className="size-4 text-primary" />
                Volver
            </Link>

            {/* Marca: pt = distancia desde arriba (% del alto de la pantalla),
                pl = distancia desde la izquierda (% del ancho del panel) */}
            <div className="relative z-10 pl-[40%] pr-8 pt-[22dvh]">
                <div className="flex items-center gap-4">
                    <img
                        src={Logo}
                        alt="Logo Ferretería Los Maestros"
                        className="w-20 shrink-0 object-contain 2xl:w-24"
                    />

                    <div className="text-2xl font-extrabold uppercase leading-tight 2xl:text-3xl">
                        <p className="text-white">Ferretería</p>
                        <p className="text-primary">Los Maestros</p>
                    </div>
                </div>

                <p className="mt-5 text-lg text-white/90 2xl:text-xl">
                    Tus proyectos, nuestra especialidad
                </p>
            </div>

            {/* Acento naranja inferior */}
            <div className="absolute -bottom-24 right-0 h-80 w-8 rotate-25 bg-primary" />
        </section>
    )
}