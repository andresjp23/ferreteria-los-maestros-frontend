import { describe, expect, it, vi } from "vitest"
import { api, ApiError, setUnauthorizedHandler, tokenStorage } from "./api"
import { apiError, mockApi, reply } from "../test/mockApi"

describe("cliente HTTP", () => {
    it("envía el token guardado en el header Authorization", async () => {
        tokenStorage.set("abc")
        const fetchMock = mockApi({ "GET /auth/me": { id: 1 } })

        await expect(api.get("/auth/me")).resolves.toEqual({ id: 1 })
        expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer abc")
    })

    it("convierte los errores del backend en ApiError con su mensaje y los errores por campo", async () => {
        mockApi({ "POST /usuarios": apiError(409, "Ya existe", { email: "Ya existe un usuario con este correo" }) })

        const error = await api.post("/usuarios", {}).catch((e) => e)

        expect(error).toBeInstanceOf(ApiError)
        expect(error.status).toBe(409)
        expect(error.message).toBe("Ya existe")
        expect(error.campos.email).toBe("Ya existe un usuario con este correo")
    })

    it("avisa si no hay conexión con el servidor", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))

        const error = await api.get("/productos").catch((e) => e)

        expect(error.status).toBe(0)
        expect(error.message).toMatch("No se pudo conectar con el servidor")
    })

    it("un 401 con sesión avisa al AuthProvider; sin sesión (login fallido) no", async () => {
        const handler = vi.fn()
        setUnauthorizedHandler(handler)
        mockApi({ "GET /auth/me": apiError(401, "Tu sesión expiró"), "POST /auth/login": apiError(401, "Incorrecto") })

        await api.post("/auth/login", {}).catch(() => {})
        expect(handler).not.toHaveBeenCalled()

        tokenStorage.set("vencido")
        await api.get("/auth/me").catch(() => {})
        expect(handler).toHaveBeenCalledWith("Tu sesión expiró")
        setUnauthorizedHandler(null)
    })

    it("una respuesta 204 sin cuerpo devuelve null", async () => {
        mockApi({ "DELETE /usuarios/5": reply(204) })
        await expect(api.delete("/usuarios/5")).resolves.toBeNull()
    })
})
