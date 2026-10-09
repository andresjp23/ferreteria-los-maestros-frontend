import bannerImage from "../../assets/hero-image.png"; // ajusta el nombre y la ruta

export default function Banner() {
    return (
        <section className="relative bg-secondary overflow-hidden">
            {/* Texto: define la altura del banner */}
            <div className="relative z-10 flex flex-col justify-center gap-2 px-6 py-6 md:px-10 md:py-8 xl:w-1/2 2xl:w-2/5 xl:pl-20 2xl:pl-28 xl:pr-8 xl:py-8">
                <p className="text-primary font-semibold text-xs md:text-sm uppercase">
                    Catálogo de productos
                </p>

                <h1 className="font-bold text-2xl md:text-3xl 2xl:text-4xl leading-tight">
                    <span className="text-white">Todo lo que necesitas,</span>
                    <br />
                    <span className="text-primary">en un solo lugar</span>
                </h1>

                <p className="text-white/90 text-sm 2xl:text-base max-w-md 2xl:max-w-lg">
                    Encuentra materiales de construcción, herramientas y ferretería general.
                </p>
            </div>

            {/* Imagen: siempre absoluta, no influye en la altura */}
            <div className="absolute inset-0 xl:left-[calc(50%-6rem)] 2xl:left-[calc(40%-6rem)]">
                <img
                    src={bannerImage}
                    alt="Casco de seguridad y guantes de trabajo sobre una mesa"
                    className="size-full object-cover object-right xl:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]"
                />

                {/* Capa oscura para que el texto se lea (solo móvil/tablet) */}
                <div className="absolute inset-0 bg-secondary/80 md:bg-linear-to-r md:from-secondary md:via-secondary/85 md:to-secondary/40 xl:hidden" />
            </div>
        </section>
    )
}