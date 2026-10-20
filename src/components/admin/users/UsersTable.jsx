import { Pencil, Trash2 } from "lucide-react"
import { roleLabels } from "../../../utils/roles"
import { formatDateTime, getInitials } from "../../../utils/format"
import StatusBadge from "../StatusBadge"

export default function UsersTable({ users }) {
    return (
        <>
            <ul className="grid gap-3 xl:hidden" aria-label="Usuarios">
                {users.map((user) => (
                    <li key={user.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start gap-3">
                            <span
                                aria-hidden="true"
                                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-500 text-xs font-semibold text-white"
                            >
                                {getInitials(user.nombre)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-secondary">{user.nombre}</p>
                                <p className="break-all text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <StatusBadge status={roleLabels[user.rol]} />
                            <StatusBadge status={user.estado} />
                        </div>

                        <dl className="mt-4 border-t border-gray-100 pt-3">
                            <dt className="text-xs font-medium text-gray-500">Último acceso</dt>
                            <dd className="mt-1 text-sm text-gray-700">{formatDateTime(user.ultimoAcceso)}</dd>
                        </dl>

                        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                            <button
                                type="button"
                                aria-label={`Editar a ${user.nombre}`}
                                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                            >
                                <Pencil className="size-4" />
                                Editar
                            </button>
                            <button
                                type="button"
                                aria-label={`Eliminar a ${user.nombre}`}
                                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
                            >
                                <Trash2 className="size-4" />
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-3xl text-left text-sm">
                <thead className="bg-slate-50 text-gray-500">
                    <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Nombre</th>
                        <th scope="col" className="px-4 py-3 font-medium">Email</th>
                        <th scope="col" className="px-4 py-3 font-medium">Rol</th>
                        <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                        <th scope="col" className="px-4 py-3 font-medium">Último acceso</th>
                        <th scope="col" className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 last:border-0">
                            {/* Avatar con las iniciales + nombre + rol */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-500 text-xs font-semibold text-white"
                                    >
                                        {getInitials(user.nombre)}
                                    </span>

                                    <div>
                                        <p className="font-semibold text-secondary">{user.nombre}</p>
                                        <p className="text-xs text-gray-500">{roleLabels[user.rol]}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-4 py-3 text-gray-600">{user.email}</td>

                            <td className="px-4 py-3">
                                <StatusBadge status={roleLabels[user.rol]} />
                            </td>

                            <td className="px-4 py-3">
                                <StatusBadge status={user.estado} />
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                                {formatDateTime(user.ultimoAcceso)}
                            </td>

                            {/* Por ahora sin acción: se conectan cuando definamos el CRUD */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <button
                                        type="button"
                                        aria-label={`Editar a ${user.nombre}`}
                                        className="transition-colors hover:text-primary"
                                    >
                                        <Pencil className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Eliminar a ${user.nombre}`}
                                        className="transition-colors hover:text-red-500"
                                    >
                                        <Trash2 className="size-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </>
    )
}
