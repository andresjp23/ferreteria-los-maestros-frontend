import heroCartImage from "../../assets/carrito-banner.webp"

export default function CartHero() {
    return (
        <section className="relative bg-secondary overflow-hidden">
            {/* Texto: define la altura del banner */}
            <div className="relative z-10 flex flex-col justify-center gap-2 px-6 py-6 md:px-10 md:py-8 xl:w-1/2 2xl:w-2/5 xl:pl-20 2xl:pl-28 xl:pr-8 xl:py-8">
                <p className="text-primary font-semibold text-xs md:text-sm uppercase">Tu Carrito</p>

                <h1 className="font-bold text-2xl md:text-3xl 2xl:text-4xl leading-tight">
                    <span className="text-white">Revisa tus productos</span>
                    <br />
                    <span className="text-primary">y continúa con tu compra</span>
                </h1>

                <p className="text-white/90 text-sm 2xl:text-base max-w-md 2xl:max-w-lg">
                    Aquí puedes ver los productos que has agregado a tu carrito, editar cantidades o eliminar los que no
                    necesitas.
                </p>
            </div>

            {/* Imagen: siempre absoluta, no influye en la altura */}
            <div className="absolute inset-0 xl:left-[calc(50%-6rem)] 2xl:left-[calc(40%-6rem)]">
                <img
                    src={heroCartImage}
                    alt="Casco de seguridad y carrito de compras sobre una mesa"
                    className="size-full object-cover object-right xl:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]"
                />

                {/* Capa oscura para que el texto se lea (solo móvil/tablet) */}
                <div className="absolute inset-0 bg-secondary/80 md:bg-linear-to-r md:from-secondary md:via-secondary/85 md:to-secondary/40 xl:hidden" />
            </div>
        </section>
    )
}
