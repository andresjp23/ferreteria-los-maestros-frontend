import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Search } from "lucide-react"

export default function NavSearchBar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Lo que hay buscado ahora mismo en la URL ("" si no hay nada)
  const urlQuery = searchParams.get("q") ?? ""

  // Lo que el usuario está escribiendo en el input
  const [text, setText] = useState(urlQuery)

  // Si la búsqueda de la URL cambia (recarga, botón atrás, otra página), actualiza el input
  useEffect(() => {
    setText(urlQuery)
  }, [urlQuery])

  // Al presionar Enter: navega a /productos con la búsqueda en la URL
  const handleSubmit = (event) => {
    event.preventDefault() // evita que el formulario recargue la página
    const clean = text.trim()
    navigate(clean ? `/productos?q=${encodeURIComponent(clean)}` : "/productos")
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-white/5 bg-white/10 px-4 py-3 transition focus-within:border-primary/60 focus-within:bg-white/15"
    >
      <Search className="size-5 shrink-0 text-white" strokeWidth={1.75} />

      <input
        type="text"
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="w-full bg-transparent text-sm text-white placeholder:text-slate-300 focus:outline-none"
      />
    </form>
  )
}