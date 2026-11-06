import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router"
import { AuthProvider } from "../../context/AuthProvider"
import { CartProvider } from "../../context/CartProvider"
import { apiError, fakeToken, mockApi } from "../../test/mockApi"
import { users } from "../../test/fixtures"
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

const renderLogin = () =>
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

const fillAndSubmit = async (user, email, password) => {
    await user.type(screen.getByLabelText("Correo electrónico"), email)
    await user.type(screen.getByLabelText("Contraseña"), password)
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }))
}

describe("sesión del cliente", () => {
    it("inicia sesión con el backend, guarda el token y lo borra al salir", async () => {
        const token = fakeToken()
        const fetchMock = mockApi({ "POST /auth/login": { token, expiraEn: "", usuario: users.cliente } })
        const user = userEvent.setup()
        renderLogin()

        await fillAndSubmit(user, "cliente@losmaestros.cl", "cliente123")

        expect(await screen.findByText("Inicio de cliente")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeInTheDocument()
        expect(localStorage.getItem("auth_token")).toBe(token)
        // Se envió al backend lo que escribió el usuario
        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
            email: "cliente@losmaestros.cl",
            password: "cliente123",
        })

        await user.click(screen.getByRole("button", { name: "Cerrar sesión" }))

        expect(screen.getByRole("link", { name: "Iniciar Sesión" })).toBeInTheDocument()
        await waitFor(() => expect(localStorage.getItem("auth_token")).toBeNull())
    })

    it("muestra el mensaje del backend si las credenciales son incorrectas", async () => {
        mockApi({ "POST /auth/login": apiError(401, "Correo o contraseña incorrectos") })
        const user = userEvent.setup()
        renderLogin()

        await fillAndSubmit(user, "cliente@losmaestros.cl", "mala")

        expect(await screen.findByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos")
        expect(localStorage.getItem("auth_token")).toBeNull()
    })
})
