import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { AuthProvider } from "../../context/AuthContext"
import ProtectedRoute from "./ProtectedRoute"

function renderProtectedRoute(initialEntry) {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<p>Login route</p>} />
                    <Route path="/" element={<p>Client home</p>} />
                    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                        <Route path="/admin" element={<p>Admin dashboard</p>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </MemoryRouter>,
    )
}

describe("rutas protegidas", () => {
    it("redirige a login cuando no hay una sesión", () => {
        renderProtectedRoute("/admin")
        expect(screen.getByText("Login route")).toBeInTheDocument()
    })

    it("redirige al usuario con rol no autorizado a la página de su rol", () => {
        localStorage.setItem("auth_user", JSON.stringify({
            id: 1,
            nombre: "Cliente de prueba",
            email: "cliente@example.cl",
            rol: "cliente",
        }))

        renderProtectedRoute("/admin")
        expect(screen.getByText("Client home")).toBeInTheDocument()
        expect(screen.queryByText("Admin dashboard")).not.toBeInTheDocument()
    })

    it("permite el acceso cuando el rol está autorizado", () => {
        localStorage.setItem("auth_user", JSON.stringify({
            id: 3,
            nombre: "Admin de prueba",
            email: "admin@example.cl",
            rol: "admin",
        }))

        renderProtectedRoute("/admin")
        expect(screen.getByText("Admin dashboard")).toBeInTheDocument()
    })
})
