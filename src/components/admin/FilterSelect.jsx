import { ChevronDown } from "lucide-react"

// Select con flecha propia (appearance-none quita la flecha del navegador).
// hideLabel: la etiqueta no se ve, pero sigue disponible para lectores de pantalla.
export default function FilterSelect({ id, label, hideLabel = false, value, onChange, children }) {
    return (
        <div>
            <label
                htmlFor={id}
                className={hideLabel ? "sr-only" : "mb-1 block text-xs font-medium text-gray-500"}
            >
                {label}
            </label>

            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-secondary outline-none transition focus:border-primary"
                >
                    {children}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
            </div>
        </div>
    )
}