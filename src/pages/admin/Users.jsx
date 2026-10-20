import { useState } from "react"
import { Plus } from "lucide-react"
import { adminUsers } from "../../mocks/adminUsers"
import { roleLabels } from "../../utils/roles"
import { normalizeText } from "../../utils/format"
import { buildUser } from "../../utils/userValidations"  
import PageHeader from "../../components/admin/PageHeader"
import UserFilters from "../../components/admin/users/UserFilters"
import UsersTable from "../../components/admin/users/UsersTable"
import Pagination from "../../components/admin/Pagination"
import Modal from "../../components/admin/Modal"
import AddUserForm from "../../components/admin/users/AddUserForm"
import Notice from "../../components/admin/Notice"  

// Cuántos usuarios se muestran por página
const PAGE_SIZE = 8

export default function AdminUsers() {
    // Filtros ("" = sin filtro) y página actual
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("")
    const [status, setStatus] = useState("")
    const [page, setPage] = useState(1)

    // modal de "Agregar usuario" y aviso de resultado
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [notice, setNotice] = useState("")


    // Cada vez que cambia un filtro se vuelve a la página 1
    const handleSearchChange = (value) => {
        setSearch(value)
        setPage(1)
    }
    const handleRoleChange = (value) => {
        setRole(value)
        setPage(1)
    }
    const handleStatusChange = (value) => {
        setStatus(value)
        setPage(1)
    }
    const handleClear = () => {
        setSearch("")
        setRole("")
        setStatus("")
        setPage(1)
    }

    // se ejecuta cuando el formulario pasa TODAS las validaciones
    const handleAddUser = (values) => {
        // Convierte los textos del formulario en el usuario con sus datos limpios (sin contraseña)
        const newUser = buildUser(values)

        // Fase 2: aquí va la llamada al backend (con la contraseña, por HTTPS).
        // Por ahora solo se muestra cómo quedaría el usuario.
        console.log("Usuario listo para enviar:", newUser)

        setIsAddOpen(false)

        // Texto del mensaje de éxito
        setNotice(`El usuario "${newUser.nombre}" pasó todas las validaciones. Por ahora no se guarda: eso llega con el backend.`)
    }

    // Texto buscado, sin mayúsculas ni tildes
    const normalizedSearch = normalizeText(search.trim())

    // Usuarios que cumplen los tres filtros a la vez (cada filtro vacío deja pasar a todos)
    const filteredUsers = adminUsers.filter((user) => {
        // Texto donde se busca: nombre, email y nombre visible del rol
        const text = normalizeText(`${user.nombre} ${user.email} ${roleLabels[user.rol]}`)

        return (
            // Todas las palabras escritas tienen que aparecer en el texto
            (normalizedSearch === "" || normalizedSearch.split(" ").every((word) => text.includes(word))) &&
            (role === "" || user.rol === role) &&
            (status === "" || user.estado === status)
        )
    })

    // Paginación
    const total = filteredUsers.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const startIndex = (page - 1) * PAGE_SIZE
    const pageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE)

    // Texto "Mostrando 1-8 de 42 usuarios"
    const summary =
        total === 0
            ? "No hay usuarios"
            : `Mostrando ${startIndex + 1}-${startIndex + pageUsers.length} de ${total} usuarios`

    return (
        <>
            <title>Usuarios | Panel de administración | Ferretería Los Maestros</title>

            <PageHeader
                title="Usuarios"
                description="Gestiona los usuarios del sistema y sus permisos."
                action={
                    <button
                        type="button"
                        onClick={() => setIsAddOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Plus className="size-5" />
                        Agregar usuario
                    </button>
                }
            />

            {/* aviso después de agregar */}
            {notice && <Notice onClose={() => setNotice("")}>{notice}</Notice>}

            <UserFilters
                search={search}
                onSearchChange={handleSearchChange}
                role={role}
                onRoleChange={handleRoleChange}
                status={status}
                onStatusChange={handleStatusChange}
                onClear={handleClear}
            />

            <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                {total === 0 ? (
                    // Ningún usuario cumple los filtros
                    <div className="py-12 text-center">
                        <p className="font-semibold text-secondary">No encontramos usuarios</p>
                        <p className="mt-1 text-sm text-gray-500">Prueba con otra búsqueda o quita algún filtro.</p>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="mt-4 text-sm font-medium text-primary hover:opacity-80"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        <UsersTable users={pageUsers} />

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500">{summary}</p>
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    </>
                )}
            </section>

            {/* modal con el formulario */}
            <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Agregar usuario">
                <AddUserForm onCancel={() => setIsAddOpen(false)} onSubmit={handleAddUser} />
            </Modal>
        </>
    )
}