import { useState, useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import { Search } from "lucide-react"

export default function NavSearchBar({ variant = "navbar" }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isCatalog = variant === "catalog"

  // Lo que hay buscado ahora mismo en la URL ("" si no hay nada)
  const urlQuery = searchParams.get("q") ?? ""

  // Lo que el usuario está escribiendo en el input
  const [text, setText] = useState(urlQuery)

  // Si la búsqueda de la URL cambia (recarga, botón atrás, otra página), actualiza el input
  useEffect(() => {
    setText(urlQuery)
  }, [urlQuery])

  // Actualiza el catálogo en cada cambio sin agregar una entrada al historial por letra.
  const handleChange = (event) => {
    const nextText = event.target.value
    const isOnCatalog = location.pathname === "/productos"
    const nextParams = isOnCatalog
      ? new URLSearchParams(searchParams)
      : new URLSearchParams()

    setText(nextText)

    if (nextText) nextParams.set("q", nextText)
    else nextParams.delete("q")

    const queryString = nextParams.toString()
    navigate(
      { pathname: "/productos", search: queryString ? `?${queryString}` : "" },
      { replace: isOnCatalog },
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex w-full max-w-xl items-center gap-3 rounded-xl border px-4 py-3 transition ${
        isCatalog
          ? "border-gray-200 bg-white focus-within:border-primary/60"
          : "border-white/5 bg-white/10 focus-within:border-primary/60 focus-within:bg-white/15"
      }`}
    >
      <Search
        className={`size-5 shrink-0 ${isCatalog ? "text-secondary" : "text-white"}`}
        strokeWidth={1.75}
      />

      <input
        type="search"
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        value={text}
        onChange={handleChange}
        className={`w-full min-w-0 bg-transparent text-sm focus:outline-none ${
          isCatalog
            ? "text-secondary placeholder:text-gray-400"
            : "text-white placeholder:text-slate-300"
        }`}
      />
    </form>
  )
}
