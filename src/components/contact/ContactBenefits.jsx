import { Truck, PackageCheck, BadgeCheck, Headset } from "lucide-react"

const benefits = [
    { icon: Truck, title: "Despacho a domicilio", text: "En la zona de cobertura" },
    { icon: PackageCheck, title: "Retiro en tienda", text: "Rápido y fácil" },
    { icon: BadgeCheck, title: "Productos de calidad", text: "Las mejores marcas" },
    { icon: Headset, title: "Atención personalizada", text: "Estamos para ayudarte" },
]

export default function ContactBenefits() {
    return (
        <section className="border-t border-slate-200 bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map(({ icon: Icon, title, text }, index) => (
                    <article
                        key={title}
                        className={`flex items-center gap-4 ${
                            index > 0 ? "lg:border-l lg:border-slate-200 lg:pl-6" : ""
                        }`}
                    >
                        <Icon className="size-9 shrink-0 text-primary" strokeWidth={1.5} />

                        <div>
                            <h3 className="text-sm font-bold text-secondary">{title}</h3>
                            <p className="mt-1 text-xs text-slate-500">{text}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
