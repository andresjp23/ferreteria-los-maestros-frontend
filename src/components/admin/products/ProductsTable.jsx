import { Pencil, Trash2 } from "lucide-react"
import { formatPrice } from "../../../utils/format"
import { getStockStatus } from "../../../utils/stock"
import { getCategoryName } from "../../../utils/catalog"
import StatusBadge from "../../ui/StatusBadge"

export default function ProductsTable({ products }) {
    return (
        <>
            <ul className="grid gap-3 xl:hidden" aria-label="Productos">
                {products.map((product) => {
                    const categoryName = getCategoryName(product.categoria)

                    return (
                        <li key={product.id} className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt=""
                                            loading="lazy"
                                            className="size-full object-contain"
                                        />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-secondary">{product.nombre}</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {product.marca} · {product.subcategoria}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">{categoryName}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <span className="text-lg font-semibold text-secondary">
                                    {formatPrice(product.precio)}
                                </span>
                                <StatusBadge status={getStockStatus(product.stock)} />
                            </div>

                            <dl className="mt-4 border-t border-gray-100 pt-3">
                                <dt className="text-xs font-medium text-gray-500">Stock</dt>
                                <dd className="mt-1 text-sm text-gray-700">
                                    {product.stock} {product.unidad}
                                </dd>
                            </dl>

                            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                                <button
                                    type="button"
                                    aria-label={`Editar ${product.nombre}`}
                                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                                >
                                    <Pencil className="size-4" />
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Eliminar ${product.nombre}`}
                                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
                                >
                                    <Trash2 className="size-4" />
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>

            <div className="hidden overflow-x-auto xl:block">
                <table className="w-full min-w-3xl text-left text-sm">
                    <thead className="bg-slate-50 text-gray-500">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Producto
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Categoría
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Precio
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Stock
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Estado
                            </th>
                            <th scope="col" className="px-4 py-3 font-medium">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => {
                            const categoryName = getCategoryName(product.categoria)

                            return (
                                <tr key={product.id} className="border-b border-gray-100 last:border-0">
                                    {/* Foto + nombre + marca y subcategoría */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1">
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt=""
                                                        loading="lazy"
                                                        className="size-full object-contain"
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-secondary">{product.nombre}</p>
                                                <p className="text-xs text-gray-500">
                                                    {product.marca} · {product.subcategoria}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-gray-600">{categoryName}</td>
                                    <td className="px-4 py-3 font-medium text-secondary">
                                        {formatPrice(product.precio)}
                                    </td>
                                    <td className="px-4 py-3 text-secondary">{product.stock}</td>

                                    <td className="px-4 py-3">
                                        <StatusBadge status={getStockStatus(product.stock)} />
                                    </td>

                                    {/* Por ahora sin acción: se conectan cuando definamos el CRUD */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <button
                                                type="button"
                                                aria-label={`Editar ${product.nombre}`}
                                                className="transition-colors hover:text-primary"
                                            >
                                                <Pencil className="size-5" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Eliminar ${product.nombre}`}
                                                className="transition-colors hover:text-red-500"
                                            >
                                                <Trash2 className="size-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}
