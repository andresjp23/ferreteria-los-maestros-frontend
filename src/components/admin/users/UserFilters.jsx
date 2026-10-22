import { Search, RefreshCw } from "lucide-react"
import { roleLabels, roles, userStatuses } from "../../../utils/roles"
import FilterSelect from "../FilterSelect"

export default function UserFilters({ search, onSearchChange, role, onRoleChange, status, onStatusChange, onClear }) {
    return (
        // Móvil: todo apilado. Tablet: búsqueda arriba y los dos selectos lado a lado.
        // Escritorio (xl): una sola fila.
        <div className="mt-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-5 md:grid-cols-2 md:p-6 xl:grid-cols-[minmax(0,1fr)_13rem_13rem_auto] xl:items-center">
            {/* Búsqueda */}
            <div className="md:col-span-2 xl:col-span-1">
                <label htmlFor="user-search" className="sr-only">
                    Buscar usuarios
                </label>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-slate-50 px-4 transition focus-within:border-primary">
                    <Search className="size-5 shrink-0 text-gray-400" />
                    <input
                        id="user-search"
                        type="text"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Buscar por nombre, email o rol..."
                        className="w-full bg-transparent py-2.5 text-sm text-secondary outline-none placeholder:text-gray-400"
                    />
                </div>
            </div>

            <FilterSelect id="user-role" label="Rol" hideLabel value={role} onChange={onRoleChange}>
                <option value="">Todos los roles</option>
                {roles.map((r) => (
                    <option key={r} value={r}>
                        {roleLabels[r]}
                    </option>
                ))}
            </FilterSelect>

            <FilterSelect id="user-status" label="Estado" hideLabel value={status} onChange={onStatusChange}>
                <option value="">Estado (todos)</option>
                {userStatuses.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </FilterSelect>

            <button
                type="button"
                onClick={onClear}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-80 md:col-span-2 xl:col-span-1"
            >
                <RefreshCw className="size-4" />
                Limpiar filtros
            </button>
        </div>
    )
}
