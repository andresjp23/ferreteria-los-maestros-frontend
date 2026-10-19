import { Pencil, Trash2 } from "lucide-react"
import { categories } from "../../../mocks/categories"
import { formatPrice } from "../../../utils/format"
import { getStockStatus } from "../../../utils/stock"
import StatusBadge from "../StatusBadge"

export default function ProductsTable({ products }) {
    return (
        // Si no cabe (móvil), la tabla se desplaza hacia el costado dentro de su tarjeta
        <div className="overflow-x-auto">
            <table className="w-full min-w-3xl text-left text-sm">
                <thead className="bg-slate-50 text-gray-500">
                    <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Producto</th>
                        <th scope="col" className="px-4 py-3 font-medium">Categoría</th>
                        <th scope="col" className="px-4 py-3 font-medium">Precio</th>
                        <th scope="col" className="px-4 py-3 font-medium">Stock</th>
                        <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                        <th scope="col" className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => {
                        // El producto guarda el id de la categoría; acá se busca su nombre visible
                        const categoryName = categories.find((c) => c.id === product.categoria)?.nombre

                        return (
                            <tr key={product.id} className="border-b border-gray-100 last:border-0">
                                {/* Foto + nombre + marca y subcategoría */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1">
                                            {product.image && (
                                                <img src={product.image} alt="" className="size-full object-contain" />
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
                                <td className="px-4 py-3 font-medium text-secondary">{formatPrice(product.precio)}</td>
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
    )
}