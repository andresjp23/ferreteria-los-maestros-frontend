// Clases de un campo: borde rojo si tiene error, naranja al enfocarlo si está bien
export const inputClass = (error) =>
    `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-secondary outline-none transition placeholder:text-gray-400 focus:ring-2 ${
        error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-primary focus:ring-primary/15"
    }`
