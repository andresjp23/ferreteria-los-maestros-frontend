import { ChevronDown } from "lucide-react"

// Clases de un campo: borde rojo si tiene error, naranja al enfocarlo si está bien
export const inputClass = (error) =>
    `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-secondary outline-none transition placeholder:text-gray-400 focus:ring-2 ${
        error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-primary focus:ring-primary/15"
    }`

// Envuelve cada campo: etiqueta (con * si es obligatorio), el campo, y el mensaje de ayuda o de error.
// prefix: se antepone al id del campo (ej. "user" -> id="user-email")
export function Field({ name, prefix = "product", label, required, error, hint, className = "", children }) {
    return (
        <div className={className}>
            <label htmlFor={`${prefix}-${name}`} className="mb-1.5 block text-sm font-medium text-secondary">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            {children}

            {/* La ayuda se oculta cuando hay error */}
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}

            {error && (
                <p id={`${prefix}-${name}-error`} role="alert" className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}

// <select> con flecha propia (appearance-none quita la del navegador)
export function SelectBox({ children, ...props }) {
    return (
        <div className="relative">
            <select {...props} className={`${props.className} appearance-none pr-10`}>
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
        </div>
    )
}