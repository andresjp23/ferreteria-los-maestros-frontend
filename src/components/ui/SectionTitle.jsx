// Título con la barrita naranja, igual que en el resto del sitio.
// size="page" para el título de la página, size="section" para los de cada bloque.
// className: clases extra para el título (por ejemplo, márgenes)
const sizes = {
    page: "text-2xl md:text-3xl",
    section: "text-lg md:text-xl",
}

export default function SectionTitle({ as: Tag = "h2", size = "section", className = "", children }) {
    return (
        <Tag className={`flex items-center gap-3 font-bold text-secondary ${sizes[size]} ${className}`}>
            <span className="h-1 w-6 shrink-0 rounded-full bg-primary md:w-8" />
            {children}
        </Tag>
    )
}
