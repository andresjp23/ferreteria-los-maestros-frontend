import { createContext } from "react"

// Espacio compartido del catálogo. Lo llena CatalogProvider y se lee con el hook useCatalog.
export const CatalogContext = createContext(null)
