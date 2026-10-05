export default function CategoryCard({ title, icon, image, href = "/productos" }) {
    return (
        <a
            href={href}
            className="group relative flex min-h-48 overflow-hidden rounded-xl bg-secondary"
        >
            {/* Imagen de fondo (parte derecha) */}
            <img
                src={image}
                alt=""
                className="absolute inset-y-0 right-0 h-full w-3/5 object-cover"
            />

            {/* Degradado: cubre el borde izquierdo de la imagen para que se funda con el fondo */}
            <div className="absolute inset-y-0 right-0 w-3/5 bg-linear-to-r from-secondary to-transparent" />

            {/* Contenido (parte izquierda) */}
            <div className="relative flex flex-col justify-between gap-6 p-6">
                <div className="size-16 text-primary [&>svg]:size-full">
                    {icon}
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>

                    <span className="inline-flex items-center gap-2 text-sm text-white">
                        Ver productos
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-4 transition-transform group-hover:translate-x-1"
                        >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </span>
                </div>
            </div>
        </a>
    )
}