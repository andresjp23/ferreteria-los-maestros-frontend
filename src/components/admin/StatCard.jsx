import { ArrowDown, ArrowUp, Minus } from "lucide-react"

// Tarjeta de indicador: ícono en círculo naranja, etiqueta, valor y variación.
// trend: variación en % respecto del mes anterior (ej. 12.5 o -8). Si es null o no se entrega, no se dibuja.
// detail: texto opcional bajo el valor (ej. "19 con stock bajo")
export default function StatCard({ icon: Icon, label, value, trend = null, note = "vs. mes anterior", detail }) {
    const TrendIcon = trend > 0 ? ArrowUp : trend < 0 ? ArrowDown : Minus
    const trendColor = trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500"
    const trendText = `${trend > 0 ? "+" : ""}${trend?.toLocaleString("es-CL")}%`

    return (
        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="size-6" />
            </span>

            {/* min-w-0 deja que el contenido se achique en vez de salirse de la tarjeta */}
            <div className="min-w-0">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="mt-1 text-2xl font-bold text-secondary">{value}</p>

                {detail && <p className="mt-2 text-xs text-gray-500">{detail}</p>}

                {trend !== null && (
                    <>
                        <p className={`mt-2 flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                            <TrendIcon className="size-4" />
                            {trendText}
                        </p>
                        <p className="text-xs text-gray-500">{note}</p>
                    </>
                )}
            </div>
        </div>
    )
}
