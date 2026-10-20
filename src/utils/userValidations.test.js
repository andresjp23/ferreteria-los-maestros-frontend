import { describe, expect, it } from "vitest"
import { validateField, validateUser } from "./userValidations"

const validUser = {
    nombre: "Ana Pérez",
    email: "ana.nueva@example.cl",
    rol: "cliente",
    estado: "Activo",
    password: "StrongPass1",
    confirmPassword: "StrongPass1",
}

describe("validación de usuarios", () => {
    it("rechaza correos inválidos o duplicados y contraseñas que incumplen las reglas", () => {
        expect(validateField("email", { ...validUser, email: "correo-invalido" })).toMatch(/correo válido/)
        expect(validateField("email", { ...validUser, email: "admin@losmaestros.cl" })).toMatch(/Ya existe/)
        expect(validateField("password", { ...validUser, password: "sin-mayuscula1" })).toMatch(/mayúscula/)
        expect(validateField("password", { ...validUser, password: "Strong Pass1" })).toMatch(/espacios/)
    })

    it("exige que la confirmación coincida y acepta un usuario válido", () => {
        expect(validateField("confirmPassword", { ...validUser, confirmPassword: "Different1" })).toBe(
            "Las contraseñas no coinciden",
        )
        expect(validateUser(validUser)).toEqual({})
    })
})
