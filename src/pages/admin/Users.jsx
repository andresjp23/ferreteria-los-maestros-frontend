import { useState } from "react"
import { Plus } from "lucide-react"
import { adminUsers } from "../../mocks/adminUsers"
import { roleLabels } from "../../utils/roles"
import { matchesAllWords } from "../../utils/format"
import { buildUser } from "../../utils/userValidations"
import usePagination from "../../hooks/usePagination"
import PageHeader from "../../components/admin/PageHeader"
import UserFilters from "../../components/admin/users/UserFilters"
import UsersTable from "../../components/admin/users/UsersTable"
import AddUserForm from "../../components/admin/users/AddUserForm"
import Pagination from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import Notice from "../../components/ui/Notice"

// Cuántos usuarios se muestran por página
const PAGE_SIZE = 8

export default function AdminUsers() {
    // Filtros ("" = sin filtro)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("")
    const [status, setStatus] = useState("")

    // modal de "Agregar usuario" y aviso de resultado
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [notice, setNotice] = useState("")

    const handleClear = () => {
        setSearch("")
        setRole("")
        setStatus("")
    }

    // se ejecuta cuando el formulario pasa TODAS las validaciones
    const handleAddUser = (values) => {
        // Convierte los textos del formulario en el usuario con sus datos limpios (sin contraseña).
        // Fase 2: aquí va la llamada al backend (con la contraseña, por HTTPS).
        const newUser = buildUser(values)

        setIsAddOpen(false)

        // Texto del mensaje de éxito
        setNotice(
            `El usuario "${newUser.nombre}" pasó todas las validaciones. Por ahora no se guarda: eso llega con el backend.`,
        )
    }

    // Usuarios que cumplen los tres filtros a la vez (cada filtro vacío deja pasar a todos).
    // En la búsqueda, todas las palabras escritas tienen que aparecer en el nombre, email o rol.
    const filteredUsers = adminUsers.filter(
        (user) =>
            matchesAllWords(`${user.nombre} ${user.email} ${roleLabels[user.rol]}`, search) &&
            (role === "" || user.rol === role) &&
            (status === "" || user.estado === status),
    )

    // Paginación: si cambia algún filtro, vuelve a la página 1
    const { page, totalPages, pageItems, setPage, start, end, total } = usePagination(filteredUsers, {
        pageSize: PAGE_SIZE,
        resetKey: `${search}|${role}|${status}`,
    })

    // Texto "Mostrando 1-8 de 42 usuarios"
    const summary = total === 0 ? "No hay usuarios" : `Mostrando ${start}-${end} de ${total} usuarios`

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
                onSearchChange={setSearch}
                role={role}
                onRoleChange={setRole}
                status={status}
                onStatusChange={setStatus}
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
                        <UsersTable users={pageItems} />

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
