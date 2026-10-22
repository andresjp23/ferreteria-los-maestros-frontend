import { Link } from "react-router"

export default function NotFound() {
    return (
        <section className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Error 404</p>
            <h1 className="mt-3 text-3xl font-extrabold text-secondary md:text-4xl">No encontramos esa página</h1>
            <p className="mt-4 max-w-xl text-gray-600">
                Puede que la dirección haya cambiado o que el enlace no sea válido.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                    to="/"
                    className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                    Volver al inicio
                </Link>
                <Link
                    to="/productos"
                    className="rounded-lg border border-secondary px-5 py-3 font-semibold text-secondary transition hover:bg-secondary hover:text-white"
                >
                    Ver productos
                </Link>
            </div>
        </section>
    )
}
