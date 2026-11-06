import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { roleLabels } from "../../utils/roles"
import { matchesAllWords } from "../../utils/format"
import { buildUser, emptyUser, userToForm } from "../../utils/userValidations"
import { createUser, deleteUser, getUsers, updateUser } from "../../services/userService"
import useAuth from "../../hooks/useAuth"
import usePagination from "../../hooks/usePagination"
import PageHeader from "../../components/admin/PageHeader"
import UserFilters from "../../components/admin/users/UserFilters"
import UsersTable from "../../components/admin/users/UsersTable"
import UserForm from "../../components/admin/users/UserForm"
import Pagination from "../../components/ui/Pagination"
import Modal from "../../components/ui/Modal"
import Notice from "../../components/ui/Notice"
import PageLoader from "../../components/ui/PageLoader"
import ErrorMessage from "../../components/ui/ErrorMessage"

// Cuántos usuarios se muestran por página
const PAGE_SIZE = 8

export default function AdminUsers() {
    // Usuarios del backend (GET /api/usuarios)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState("")

    // Cuenta con sesión: no puede eliminarse a sí misma
    const { user: currentUser } = useAuth()

    // Filtros ("" = sin filtro)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("")
    const [status, setStatus] = useState("")

    // editor: null = modal cerrado; { user: null } = agregar; { user } = editar ese usuario
    const [editor, setEditor] = useState(null)

    // Aviso de resultado: { tone: "success" | "error", text }
    const [notice, setNotice] = useState(null)

    const loadUsers = useCallback(
        () =>
            getUsers()
                .then((list) => {
                    setUsers(list)
                    setLoadError("")
                })
                .catch((error) => setLoadError(error.message))
                .finally(() => setLoading(false)),
        [],
    )

    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    const handleClear = () => {
        setSearch("")
        setRole("")
        setStatus("")
    }

    // Lo llama el formulario cuando pasa sus validaciones. Si el backend rechaza los datos
    // (ej. correo repetido → 409), devuelve { mensaje, campos } para mostrarlos en el formulario.
    const handleSave = async (values) => {
        const editing = editor.user !== null
        try {
            const saved = editing
                ? await updateUser(editor.user.id, buildUser(values))
                : await createUser(buildUser(values))

            setEditor(null)
            setNotice({
                tone: "success",
                text: editing
                    ? `Se guardaron los cambios de "${saved.nombre}".`
                    : `El usuario "${saved.nombre}" se creó correctamente.`,
            })
            loadUsers()
        } catch (error) {
            return { mensaje: error.message, campos: error.campos }
        }
    }

    const handleDelete = async (user) => {
        if (!window.confirm(`¿Eliminar la cuenta de "${user.nombre}"? Esta acción no se puede deshacer.`)) return

        try {
            await deleteUser(user.id)
            setNotice({ tone: "success", text: `La cuenta de "${user.nombre}" se eliminó.` })
            loadUsers()
        } catch (error) {
            // Ej. 409: el usuario tiene pedidos y hay que desactivarlo en vez de eliminarlo
            setNotice({ tone: "error", text: error.message })
        }
    }

    // Usuarios que cumplen los tres filtros a la vez (cada filtro vacío deja pasar a todos).
    // En la búsqueda, todas las palabras escritas tienen que aparecer en el nombre, email o rol.
    const filteredUsers = users.filter(
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
                        onClick={() => setEditor({ user: null })}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Plus className="size-5" />
                        Agregar usuario
                    </button>
                }
            />

            {/* Aviso después de agregar, editar o eliminar */}
            {notice && (
                <Notice tone={notice.tone} onClose={() => setNotice(null)}>
                    {notice.text}
                </Notice>
            )}

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
                {loading ? (
                    <PageLoader text="Cargando usuarios..." />
                ) : loadError ? (
                    <ErrorMessage onRetry={loadUsers}>{loadError}</ErrorMessage>
                ) : total === 0 ? (
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
                        <UsersTable
                            users={pageItems}
                            currentUserId={currentUser?.id}
                            onEdit={(user) => setEditor({ user })}
                            onDelete={handleDelete}
                        />

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500">{summary}</p>
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    </>
                )}
            </section>

            <Modal
                open={editor !== null}
                onClose={() => setEditor(null)}
                title={editor?.user ? "Editar usuario" : "Agregar usuario"}
            >
                {/* key: al abrir otro usuario, el formulario parte de cero con sus datos */}
                {editor && (
                    <UserForm
                        key={editor.user?.id ?? "nuevo"}
                        initialValues={editor.user ? userToForm(editor.user) : emptyUser}
                        editing={editor.user !== null}
                        onCancel={() => setEditor(null)}
                        onSubmit={handleSave}
                    />
                )}
            </Modal>
        </>
    )
}
