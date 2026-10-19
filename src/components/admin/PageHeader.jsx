import SectionTitle from "./SectionTitle"

export default function PageHeader({ title, description, action }) {
    return (
        // En móvil el botón queda debajo del título; desde sm, a la derecha
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <SectionTitle as="h1" size="page">{title}</SectionTitle>
                <p className="mt-2 text-sm text-gray-600 md:text-base">{description}</p>
            </div>

            {action}
        </div>
    )
}