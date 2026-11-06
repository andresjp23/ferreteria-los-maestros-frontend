import { vi } from "vitest"

// Simula el backend en los tests reemplazando fetch.
// routes: { "GET /productos": cuerpo | reply(status, cuerpo) | (request) => cuerpo o reply(...) }
// Las rutas se escriben sin el prefijo /api. Devuelve el mock de fetch para revisar las llamadas.
export function mockApi(routes) {
    const fetchMock = vi.fn(async (url, options = {}) => {
        const method = options.method ?? "GET"
        const path = new URL(url).pathname.replace(/^\/api/, "")
        let result = routes[`${method} ${path}`]

        if (result === undefined) {
            return jsonResponse(404, { status: 404, mensaje: `Ruta sin simular: ${method} ${path}`, campos: {} })
        }
        if (typeof result === "function") {
            result = await result({
                headers: options.headers ?? {},
                body: options.body ? JSON.parse(options.body) : undefined,
            })
        }
        return result?.isReply ? jsonResponse(result.status, result.body) : jsonResponse(200, result)
    })

    vi.stubGlobal("fetch", fetchMock)
    return fetchMock
}

// Respuesta con un código distinto de 200 (ej. reply(409, { mensaje: "..." }))
export const reply = (status, body = null) => ({ isReply: true, status, body })

// Error con el formato de la API
export const apiError = (status, mensaje, campos = {}) => reply(status, { status, error: "", mensaje, campos })

const jsonResponse = (status, body) =>
    new Response(status === 204 || body === null ? null : JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    })

// JWT de prueba (sin firma real): el frontend solo lee "exp" para saber cuándo vence
export const fakeToken = ({ minutes = 60 } = {}) => {
    const payload = btoa(JSON.stringify({ sub: "1", exp: Math.floor(Date.now() / 1000) + minutes * 60 }))
    return `header.${payload}.firma`
}
