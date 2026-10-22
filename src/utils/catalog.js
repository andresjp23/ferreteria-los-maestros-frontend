import { products } from "../mocks/products"
import { categories } from "../mocks/categories"

// Índices por id: buscar en un Map es directo, en vez de recorrer el arreglo con find en cada render.
// En la fase 2 estos datos vendrán del backend.
const categoryNames = new Map(categories.map((c) => [c.id, c.nombre]))
const productsById = new Map(products.map((p) => [p.id, p]))

// Nombre visible de una categoría a partir de su id: "materiales-construccion" -> "Materiales de construcción"
export const getCategoryName = (id) => categoryNames.get(id) ?? id

export const getProductById = (id) => productsById.get(id)
