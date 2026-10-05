import { Truck, Store, ShieldCheck, Headset } from "lucide-react"

const benefits = [
    {
        icon: Truck,
        title: "Despacho a domicilio",
        description: "En la zona de cobertura",
    },
    {
        icon: Store,
        title: "Retiro en tienda",
        description: "Rápido y fácil",
    },
    {
        icon: ShieldCheck,
        title: "Productos de calidad",
        description: "Las mejores marcas",
    },
    {
        icon: Headset,
        title: "Atención personalizada",
        description: "Estamos para ayudarte",
    },
]

export default function BenefitsSection() {
    return (
        <section className="px-6 pb-10 md:px-10 md:pb-12 xl:px-20 xl:pb-14">
            <div className="flex items-center gap-3">
                <span className="h-1 w-6 rounded-full bg-primary md:w-8" />
                <h2 className="text-2xl font-bold text-secondary md:text-3xl">
                    Beneficios
                </h2>
            </div>
            <div className="grid gap-6  border-gray-200 pt-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-0 xl:divide-x xl:divide-gray-200">
                {benefits.map(({ icon: Icon, title, description }) => (
                    <div
                        key={title}
                        className="flex items-center gap-4 xl:px-8 xl:first:pl-0"
                    >
                        <Icon className="size-10 shrink-0 text-primary" strokeWidth={1.5} />

                        <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-secondary md:text-base">
                                {title}
                            </h3>
                            <p className="text-xs text-gray-500 md:text-sm">
                                {description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}