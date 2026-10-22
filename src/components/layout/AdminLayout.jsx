import { useState } from "react"
import { Outlet } from "react-router"
import AdminSidebar from "../admin/AdminSidebar"
import AdminTopbar from "../admin/AdminTopbar"

export default function AdminLayout() {
    // Si el menú lateral está abierto (solo importa en móvil y tablet)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-dvh bg-slate-50 text-slate-800">
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Desde xl el sidebar es fijo y ocupa 16rem (w-64): el contenido se corre ese ancho */}
            <div className="flex min-h-dvh flex-col xl:pl-64">
                <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
                    {/* Aquí se dibuja la página del panel que corresponda */}
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
