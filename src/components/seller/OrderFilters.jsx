import { Search, RotateCcw } from "lucide-react"
import { orderStatuses } from "../../utils/orders"

export default function OrderFilters({ search, onSearchChange, status, onStatusChange, date, onDateChange, onClear }) {
    return (
        <section className="grid gap-3 rounded-xl border border-blue-100 bg-white p-4 lg:grid-cols-[minmax(240px,1fr)_180px_180px_auto] lg:items-center">
            <div className="flex items-center gap-3 rounded-full border border-transparent bg-slate-100 px-4 py-3 transition focus-within:border-primary">
                <Search className="size-5 shrink-0 text-slate-500" />

                <input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Buscar por N° de pedido, cliente o producto..."
                    aria-label="Buscar pedidos"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
            </div>

            <label className="flex flex-col gap-1 text-xs text-slate-500">
                Estado
                <select
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-secondary outline-none focus:border-primary"
                >
                    <option value="Todos">Todos</option>
                    {orderStatuses.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-slate-500">
                Fecha
                <select
                    value={date}
                    onChange={(event) => onDateChange(event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-secondary outline-none focus:border-primary"
                >
                    <option value="Todas">Todas</option>
                    <option value="7">Últimos 7 días</option>
                    <option value="30">Últimos 30 días</option>
                </select>
            </label>

            <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center justify-center gap-2 px-2 py-3 text-sm font-medium text-primary hover:underline"
            >
                <RotateCcw className="size-4" />
                Limpiar filtros
            </button>
        </section>
    )
}
