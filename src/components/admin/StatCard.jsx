import { ArrowUp } from "lucide-react"

// Tarjeta de indicador: ícono en círculo naranja, etiqueta, valor y variación
export default function StatCard({ icon: Icon, label, value, trend, note = "vs. mes anterior" }) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="size-6" />
            </span>

            {/* min-w-0 deja que el contenido se achique en vez de salirse de la tarjeta */}
            <div className="min-w-0">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="mt-1 text-2xl font-bold text-secondary">{value}</p>

                {/* La variación solo se dibuja si se entrega */}
                {trend && (
                    <>
                        <p className="mt-2 flex items-center gap-1 text-sm font-medium text-green-600">
                            <ArrowUp className="size-4" />
                            {trend}
                        </p>
                        <p className="text-xs text-gray-500">{note}</p>
                    </>
                )}
            </div>
        </div>
    )
}