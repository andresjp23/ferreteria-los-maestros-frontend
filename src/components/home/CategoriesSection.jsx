import { BrickWall, Hammer, Wrench, ArrowRight } from "lucide-react"
import CategoryCard from "../ui/CategoryCard"
import Materiales from "../../assets/categories/materiales-image.png"
import Martillo from "../../assets/categories/martillos.png"
import Gasfiteria from "../../assets/categories/gasfiteria.png"

export default function CategoriesSection() {
    return (
        <section className="px-6 py-10 md:px-10 md:py-12 xl:px-20 xl:py-14">
            {/* Encabezado de la sección */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="h-1 w-6 rounded-full bg-primary md:w-8" />
                    <h2 className="text-2xl font-bold text-secondary md:text-3xl">
                        Categorías
                    </h2>
                </div>

                <a
                    href="/categorias"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                    Ver todas
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
            </div>

            {/* Tarjetas */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <CategoryCard
                    title="Materiales de construcción"
                    icon={<BrickWall />}
                    image={Materiales}
                />
                <CategoryCard
                    title="Herramientas"
                    icon={<Hammer />}
                    image={Martillo}
                />
                <CategoryCard
                    title="Gasfitería y electricidad"
                    icon={<Wrench />}
                    image={Gasfiteria}
                />
            </div>
        </section>
    )
}