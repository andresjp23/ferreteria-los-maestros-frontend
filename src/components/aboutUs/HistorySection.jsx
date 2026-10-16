export default function HistorySection() {
    return (
        <div>
            {/* Encabezado con la barrita naranja */}
            <div className="mb-4 flex items-center gap-3">
                <span className="h-1 w-6 rounded-full bg-primary md:w-8" />
                <h2 className="text-lg font-bold text-secondary md:text-xl">
                    Nuestra historia
                </h2>
            </div>

            {/* Contenido alineado con el texto del título (desde md, igual que el diseño) */}
            <div className="md:pl-11">
                <h3 className="text-2xl font-bold leading-tight text-secondary md:text-3xl">
                    Llevamos la experiencia
                    <br className="hidden md:block" />
                    de la construcción en cada proyecto
                </h3>

                <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-gray-600 md:text-base">
                    <p>
                        Ferretería Los Maestros nace con la idea de entregar soluciones completas y confiables para quienes construyen, reparan o mejoran sus espacios. Somos un equipo apasionado por el trabajo bien hecho, con años de experiencia en el rubro y un fuerte compromiso con nuestros clientes.
                    </p>
                    <p>
                        Con más de 800 productos en stock, ofrecemos una amplia variedad de materiales, herramientas y artículos de ferretería, siempre con la mejor atención y asesoría.
                    </p>
                </div>
            </div>
        </div>
    )
}