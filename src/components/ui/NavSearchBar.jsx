export default function NavSearchBar() {
  return (
    <div className="flex items-center w-full max-w-xs bg-gray-100 rounded-lg px-3 py-1.5 border border-transparent focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-sm transition-all">
      {/* Icono de Lupa */}
      <svg 
        className="w-4 h-4 text-gray-400 mr-2 shrink-0" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://w3.org"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      {/* Campo de Entrada */}
      <input 
        type="text" 
        placeholder="Buscar productos..." 
        className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
      />
    </div>
  );
}
