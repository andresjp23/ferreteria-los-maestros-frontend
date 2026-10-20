import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router"
import { AuthProvider } from "../../context/AuthContext"
import { CartProvider } from "../../context/CartContext"
import Login from "../../pages/Login"
import Navbar from "../layout/Navbar"

function TestHome() {
    return (
        <>
            <Navbar />
            <p>Inicio de cliente</p>
        </>
    )
}

describe("sesión del cliente", () => {
    it("redirige al inicio, cambia a cerrar sesión y elimina la sesión al salir", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={["/login"]}>
                <AuthProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<TestHome />} />
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </MemoryRouter>,
        )

        await user.type(screen.getByLabelText("Correo electrónico"), "cliente@losmaestros.cl")
        await user.type(screen.getByLabelText("Contraseña"), "cliente123")
        await user.click(screen.getByRole("button", { name: "Iniciar sesión" }))

        expect(await screen.findByText("Inicio de cliente")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeInTheDocument()
        await waitFor(() => {
            expect(JSON.parse(localStorage.getItem("auth_user"))).toMatchObject({ rol: "cliente" })
        })

        await user.click(screen.getByRole("button", { name: "Cerrar sesión" }))

        expect(screen.getByRole("link", { name: "Iniciar Sesión" })).toBeInTheDocument()
        await waitFor(() => expect(localStorage.getItem("auth_user")).toBeNull())
    })
})
