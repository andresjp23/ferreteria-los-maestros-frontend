import { Package, ShieldCheck, Truck, Store } from "lucide-react"

const benefits = [
    {
        icon: Package,
        title: "Amplio catálogo",
        description: "Más de 800 productos en un solo lugar.",
    },
    {
        icon: ShieldCheck,
        title: "Calidad garantizada",
        description: "Trabajamos con las mejores marcas del mercado.",
    },
    {
        icon: Truck,
        title: "Despacho a domicilio",
        description: "En la zona de cobertura.",
    },
    {
        icon: Store,
        title: "Retiro en tienda",
        description: "Rápido y fácil.",
    },
]

export default function WhyChooseUs() {
    return (
        <div className="rounded-2xl bg-slate-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-secondary md:text-xl">¿Por qué elegirnos?</h2>

            <ul className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8">
                {benefits.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="flex items-start gap-4">
                        {/* Cuadro con el ícono */}
                        <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-7" strokeWidth={1.5} />
                        </span>

                        <div>
                            <h3 className="font-semibold text-secondary">{title}</h3>
                            <p className="mt-1 text-sm text-gray-500">{description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
