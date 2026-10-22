import { Link } from "react-router"
import { BrickWall, Hammer, Wrench, ArrowRight } from "lucide-react"
import CategoryCard from "../ui/CategoryCard"
import Materiales from "../../assets/categories/materiales-image.webp"
import Martillo from "../../assets/categories/martillos.webp"
import Gasfiteria from "../../assets/categories/gasfiteria.webp"
import SectionTitle from "../ui/SectionTitle"
import { getCategoryName } from "../../utils/catalog"

// Categorías destacadas en el inicio.
// slug = el mismo valor del campo "categoria" en los productos (el nombre visible sale del catálogo)
const featured = [
    { slug: "materiales-construccion", icon: BrickWall, image: Materiales },
    { slug: "herramientas", icon: Hammer, image: Martillo },
    { slug: "gasfiteria", icon: Wrench, image: Gasfiteria },
]

export default function CategoriesSection() {
    return (
        <section className="px-6 py-10 md:px-10 md:py-12 xl:px-20 xl:py-14">
            {/* Encabezado de la sección */}
            <div className="mb-6 flex items-center justify-between">
                <SectionTitle size="page">Categorías</SectionTitle>

                <Link to="/productos" className="group inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Ver todas
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Tarjetas: cada una lleva a Productos con su categoría */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featured.map(({ slug, icon: Icon, image }) => (
                    <Link
                        key={slug}
                        to={`/productos?categoria=${slug}`}
                        className="block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <CategoryCard title={getCategoryName(slug)} icon={<Icon />} image={image} />
                    </Link>
                ))}
            </div>
        </section>
    )
}
