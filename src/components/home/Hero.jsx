import heroImage from "../../assets/hero-image.png";

export default function Hero() {
    return (
        <section className="relative flex flex-col xl:flex-row bg-secondary overflow-hidden xl:min-h-130">
            {/* Parte izquierda: queda por encima de la imagen en móvil/tablet */}
            <div className="relative z-10 flex flex-col justify-center gap-6 px-6 py-16 md:px-10 md:py-20 xl:w-2/5 xl:shrink-0 xl:pl-20 xl:py-0">
                <p className="text-primary font-semibold text-sm md:text-base uppercase">
                    Materiales de construcción, herramientas y ferretería general
                </p>

                <h1 className="font-bold text-4xl md:text-5xl xl:text-6xl leading-tight">
                    <span className="text-white">Todo lo que necesitas</span>
                    <br />
                    <span className="text-primary">en un solo lugar</span>
                </h1>

                <p className="text-white/90 text-base md:text-lg max-w-md">
                    Calidad, variedad y el mejor servicio para tus proyectos, grandes o pequeños.
                </p>

                <a
                    href="/productos"
                    className="inline-flex items-center gap-2 self-start bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
                >
                    Ver productos
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                    >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </a>
            </div>

            {/* Parte derecha: fondo en móvil/tablet, columna en escritorio */}
            <div className="absolute inset-0 xl:static xl:flex-1 xl:-ml-24">
                <img
                    src={heroImage}
                    alt="Casco de seguridad, martillo y herramientas sobre una mesa de trabajo"
                    className="size-full object-cover object-right xl:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]"
                />

                {/* Capa oscura para que el texto se lea (solo móvil/tablet) */}
                <div className="absolute inset-0 bg-secondary/80 md:bg-linear-to-r md:from-secondary md:via-secondary/85 md:to-secondary/40 xl:hidden" />
            </div>
        </section>
    )
}