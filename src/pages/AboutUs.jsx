import HeroAboutUs from "../components/aboutUs/HeroAboutUs"
import HistorySection from "../components/aboutUs/HistorySection"
import WhyChooseUs from "../components/aboutUs/WhyChooseUs"

export default function AboutUs() {
    return (
        <>
            <title>Sobre Nosotros | Ferretería Los Maestros</title>

            <HeroAboutUs />

            {/* Historia + Por qué elegirnos: 1 columna en móvil y tablet, 2 en escritorio */}
            <section className="grid gap-10 px-6 py-10 md:px-10 md:py-12 xl:grid-cols-[5fr_6fr] xl:items-start xl:gap-16 xl:px-20 xl:py-14">
                <HistorySection />
                <WhyChooseUs />
            </section>

            {/* Aquí irá la sección "Nuestros valores" (banda oscura de borde a borde) */}
        </>
    )
}
