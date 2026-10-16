import {
  User,
  Mail,
  Phone,
  CircleChevronDown,
  ChevronDown,
  MessageSquareText,
  Send,
} from "lucide-react";

const inputBase =
  "w-full rounded-md border border-slate-200 bg-white text-sm text-secondary outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20";

// Contenedor con icono a la izquierda
function Field({ icon: Icon, iconPosition = "top-1/2 -translate-y-1/2", className = "", children }) {
  return (
    <div className={`relative ${className}`}>
      <Icon
        className={`pointer-events-none absolute left-4 size-5 text-slate-400 ${iconPosition}`}
        strokeWidth={1.5}
      />
      {children}
    </div>
  );
}

export default function ContactForm() {
  return (
    <section className="rounded-2xl bg-slate-100/80 p-5 md:p-8">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-secondary">
        <span className="h-1 w-7 rounded bg-primary" />
        Envíanos un mensaje
      </h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          alert("Formulario de demostración: todavía no se envía.");
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={User}>
            <input
              className={`${inputBase} py-4 pl-12 pr-4`}
              name="nombre"
              placeholder="Nombre completo *"
              aria-label="Nombre completo"
              autoComplete="name"
              required
            />
          </Field>

          <Field icon={Mail}>
            <input
              className={`${inputBase} py-4 pl-12 pr-4`}
              name="correo"
              type="email"
              placeholder="Correo electrónico *"
              aria-label="Correo electrónico"
              autoComplete="email"
              required
            />
          </Field>

          <Field icon={Phone}>
            <input
              className={`${inputBase} py-4 pl-12 pr-4`}
              name="telefono"
              type="tel"
              placeholder="Teléfono (opcional)"
              aria-label="Teléfono"
              autoComplete="tel"
            />
          </Field>

          <Field icon={CircleChevronDown}>
            <label
              htmlFor="asunto"
              className="pointer-events-none absolute left-12 top-2.5 text-xs text-slate-500"
            >
              Asunto *
            </label>
            <select
              id="asunto"
              name="asunto"
              defaultValue=""
              required
              className={`${inputBase} appearance-none pb-2 pl-12 pr-10 pt-7`}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="productos">Consulta de productos</option>
              <option value="cotizacion">Solicitar cotización</option>
              <option value="despacho">Consulta de despacho</option>
              <option value="otro">Otro</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
              strokeWidth={1.75}
            />
          </Field>
        </div>

        <Field icon={MessageSquareText} iconPosition="top-4">
          <label
            htmlFor="mensaje"
            className="pointer-events-none absolute left-12 top-3 text-xs text-slate-500"
          >
            Mensaje *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            required
            placeholder="Escribe tu mensaje aquí..."
            className={`${inputBase} min-h-32 resize-y pb-3 pl-12 pr-4 pt-8`}
          />
        </Field>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-4 font-bold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Send className="size-5" strokeWidth={2} />
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}