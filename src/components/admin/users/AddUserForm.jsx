import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { roleLabels, roles, userStatuses } from "../../../utils/roles"
import { emptyUser, validateField, validateUser } from "../../../utils/userValidations"
import { Field, SelectBox } from "../FormField"
import { inputClass } from "../inputClass"

// Field con el prefijo "user": los id quedan user-nombre, user-email...
const UserField = (props) => <Field prefix="user" {...props} />

export default function AddUserForm({ onCancel, onSubmit }) {
    // Lo que el usuario escribe y los errores de cada campo ({} = sin errores)
    const [values, setValues] = useState(emptyUser)
    const [errors, setErrors] = useState({})

    // Si las contraseñas se ven en texto o con puntos (un solo botón para las dos)
    const [showPassword, setShowPassword] = useState(false)

    // Guarda el error de un campo, o lo borra si el mensaje viene vacío
    const setFieldError = (name, message) => {
        setErrors((prev) => {
            const next = { ...prev }
            if (message) next[name] = message
            else delete next[name]
            return next
        })
    }

    // Se ejecuta en cada tecla de los campos
    const handleChange = (event) => {
        const { name, value } = event.target

        const newValues = { ...values, [name]: value }
        setValues(newValues)

        // Si el campo ya tenía error, se revisa de nuevo mientras escribe:
        // así el mensaje desaparece apenas se corrige
        if (errors[name]) setFieldError(name, validateField(name, newValues))

        // Confirmar contraseña depende de la contraseña: si ya tiene algo escrito, se revisa de nuevo
        if (name === "password" && (values.confirmPassword || errors.confirmPassword)) {
            setFieldError("confirmPassword", validateField("confirmPassword", newValues))
        }
    }

    // Al salir de un campo se revisa
    const handleBlur = (event) => {
        const { name } = event.target
        setFieldError(name, validateField(name, values))
    }

    // Al enviar: revisa TODOS los campos
    const handleSubmit = (event) => {
        event.preventDefault() // evita que el navegador recargue la página

        const newErrors = validateUser(values)
        setErrors(newErrors)

        // Si hay errores, lleva el foco al primer campo con problema y no envía
        const firstInvalid = Object.keys(newErrors)[0]
        if (firstInvalid) {
            document.getElementById(`user-${firstInvalid}`)?.focus()
            return
        }

        onSubmit(values)
    }

    // Propiedades comunes de todos los campos controlados
    const fieldProps = (name) => ({
        id: `user-${name}`,
        name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur,
        // Avisa a los lectores de pantalla que el campo tiene error y dónde está el mensaje
        "aria-invalid": errors[name] ? true : undefined,
        "aria-describedby": errors[name] ? `user-${name}-error` : undefined,
        className: inputClass(errors[name]),
    })

    // Campo de contraseña con el botón de mostrar u ocultar (pr-11 deja espacio al ícono)
    const passwordInput = (name, placeholder) => (
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={placeholder}
                {...fieldProps(name)}
                className={`${inputClass(errors[name])} pr-11`}
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-secondary"
            >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
        </div>
    )

    const errorCount = Object.keys(errors).length

    return (
        // noValidate: desactiva los mensajes del navegador, para mostrar solo los nuestros
        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            {/* Zona con scroll propio: el encabezado y los botones quedan siempre visibles */}
            <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
                <p className="mb-5 text-xs text-gray-500">
                    Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
                </p>

                <div className="grid gap-5 md:grid-cols-2">
                    <UserField
                        name="nombre"
                        label="Nombre completo"
                        required
                        error={errors.nombre}
                        hint="Nombre y apellido. Solo letras."
                        className="md:col-span-2"
                    >
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="Ej.: María González"
                            data-autofocus
                            {...fieldProps("nombre")}
                        />
                    </UserField>

                    <UserField
                        name="email"
                        label="Correo electrónico"
                        required
                        error={errors.email}
                        className="md:col-span-2"
                    >
                        <input
                            type="email"
                            autoComplete="off"
                            placeholder="nombre@dominio.cl"
                            {...fieldProps("email")}
                        />
                    </UserField>

                    <UserField name="rol" label="Rol" required error={errors.rol}>
                        <SelectBox {...fieldProps("rol")}>
                            <option value="">Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {roleLabels[role]}
                                </option>
                            ))}
                        </SelectBox>
                    </UserField>

                    <UserField name="estado" label="Estado" required error={errors.estado}>
                        <SelectBox {...fieldProps("estado")}>
                            {userStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </SelectBox>
                    </UserField>

                    <UserField
                        name="password"
                        label="Contraseña"
                        required
                        error={errors.password}
                        hint="8 a 64 caracteres, con mayúscula, minúscula y número, sin espacios."
                    >
                        {passwordInput("password", "Crea una contraseña")}
                    </UserField>

                    <UserField
                        name="confirmPassword"
                        label="Confirmar contraseña"
                        required
                        error={errors.confirmPassword}
                    >
                        {passwordInput("confirmPassword", "Repite la contraseña")}
                    </UserField>
                </div>
            </div>

            {/* Botones */}
            <div className="border-t border-gray-200 px-5 py-4 md:px-6">
                {errorCount > 0 && (
                    <p role="alert" className="mb-3 text-sm text-red-600">
                        {errorCount === 1 ? "Revisa el campo con error." : `Revisa los ${errorCount} campos con error.`}
                    </p>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Agregar usuario
                    </button>
                </div>
            </div>
        </form>
    )
}
