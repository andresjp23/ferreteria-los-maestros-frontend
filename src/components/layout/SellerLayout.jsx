
import { useState } from "react"
import { Outlet } from "react-router"
import SellerSidebar from "../seller/SellerSidebar"
import SellerTopbar from "../seller/SellerTopbar"

export default function SellerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-dvh bg-slate-50 text-slate-800">
            <SellerSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-h-dvh flex-col xl:pl-64">
                <SellerTopbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
