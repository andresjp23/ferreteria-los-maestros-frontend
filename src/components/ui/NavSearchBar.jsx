import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"

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
      className="flex items-center w-full max-w-xs bg-gray-100 rounded-lg px-3 py-1.5 border border-transparent focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-sm transition-all"
    >
      {/* Icono de Lupa */}
      <svg
        className="w-4 h-4 text-gray-400 mr-2 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      {/* Campo de Entrada */}
      <input
        type="text"
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
      />
    </form>
  )
}