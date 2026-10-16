import { MapPin, Phone, Mail, Clock } from "lucide-react";

const details = [
  {
    icon: MapPin,
    title: "Nuestra dirección",
    main: "Dirección de la tienda, La Serena",
    note: "Región de Coquimbo",
  },
  {
    icon: Phone,
    title: "Teléfono",
    main: "+56 9 1234 5678",
    href: "tel:+56912345678",
    note: "Lunes a Viernes · 8:30 a 18:00 hrs",
  },
  {
    icon: Mail,
    title: "Correo electrónico",
    main: "contacto@ferreterialosmaestros.cl",
    href: "mailto:contacto@ferreterialosmaestros.cl",
    note: "Te responderemos lo antes posible",
  },
  {
    icon: Clock,
    title: "Horario de atención",
    main: "Lunes a Viernes · 8:30 a 18:00 hrs",
    note: "Sábado · 8:30 a 14:00 hrs",
  },
];

export default function ContactDetails() {
  return (
    <section className="lg:pt-8">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-secondary">
        <span className="h-1 w-7 rounded bg-primary" />
        Información de contacto
      </h2>

      <div className="space-y-5">
        {details.map(({ icon: Icon, title, main, href, note }) => (
          <article key={title} className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-primary">
              <Icon className="size-6" strokeWidth={1.75} />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-secondary">{title}</h3>

              {href ? (
                <a
                  href={href}
                  className="mt-1 block wrap-break-word text-sm text-slate-700 hover:text-primary"
                >
                  {main}
                </a>
              ) : (
                <p className="mt-1 wrap-break-word text-sm text-slate-700">{main}</p>
              )}

              <p className="mt-0.5 text-xs text-slate-500">{note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}