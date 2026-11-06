import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { AuthProvider } from "../../context/AuthProvider"
import { apiError, fakeToken, mockApi } from "../../test/mockApi"
import { users } from "../../test/fixtures"
import Login from "../../pages/Login"
import ProtectedRoute from "./ProtectedRoute"

function renderProtectedRoute(initialEntry) {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<p>Client home</p>} />
                    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                        <Route path="/admin" element={<p>Admin dashboard</p>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </MemoryRouter>,
    )
}

describe("rutas protegidas y persistencia de la sesión", () => {
    it("redirige a login cuando no hay una sesión", () => {
        renderProtectedRoute("/admin")
        expect(screen.getByRole("heading", { name: /Inicia sesión/ })).toBeInTheDocument()
    })

    it("al recargar, restaura la sesión con /auth/me antes de decidir", async () => {
        localStorage.setItem("auth_token", fakeToken())
        mockApi({ "GET /auth/me": users.admin })

        renderProtectedRoute("/admin")

        // Mientras el backend responde, se espera (no se manda al login)
        expect(screen.getByText("Cargando...")).toBeInTheDocument()
        expect(await screen.findByText("Admin dashboard")).toBeInTheDocument()
    })

    it("redirige al usuario con rol no autorizado a la página de su rol", async () => {
        localStorage.setItem("auth_token", fakeToken())
        mockApi({ "GET /auth/me": users.cliente })

        renderProtectedRoute("/admin")

        expect(await screen.findByText("Client home")).toBeInTheDocument()
        expect(screen.queryByText("Admin dashboard")).not.toBeInTheDocument()
    })

    it("un token vencido se descarta sin llamar al backend y se avisa en el login", () => {
        localStorage.setItem("auth_token", fakeToken({ minutes: -5 }))
        const fetchMock = mockApi({})

        renderProtectedRoute("/admin")

        expect(screen.getByRole("alert")).toHaveTextContent("Tu sesión expiró. Inicia sesión nuevamente")
        expect(localStorage.getItem("auth_token")).toBeNull()
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("si el backend rechaza el token (401), cierra la sesión y muestra su mensaje", async () => {
        localStorage.setItem("auth_token", fakeToken())
        mockApi({ "GET /auth/me": apiError(401, "Sesión inválida. Inicia sesión nuevamente") })

        renderProtectedRoute("/admin")

        expect(await screen.findByRole("alert")).toHaveTextContent("Sesión inválida. Inicia sesión nuevamente")
        expect(localStorage.getItem("auth_token")).toBeNull()
    })
})
