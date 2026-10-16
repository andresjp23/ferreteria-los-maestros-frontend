import ContactHero from "../components/contact/ContactHero";
import ContactDetails from "../components/contact/ContactDetails";
import ContactForm from "../components/contact/ContactForm";

export default function Contact() {
  return (
    <main className="min-h-screen bg-slate-50">
      <title>Contacto | Ferretería Los Maestros</title>
      <ContactHero />

      <section className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-10 md:px-8 lg:grid-cols-[0.8fr_1.7fr] lg:gap-12 lg:py-12">
        <ContactDetails />
        <ContactForm />
      </section>
    </main>
  );
}