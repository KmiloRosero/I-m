import { ServicesExplorer } from '@/components/services/ServicesExplorer'
import { Section } from '@/components/ui/Section'
import { services, serviceTypes } from '@/data/services'

export function ServicesSection() {
  return (
    <Section id="servicios" title="Servicios" titleAlign="end" tone="red">
      <p className="lead-text mt-6 max-w-text">
        Esto es lo que ya he hecho en proyectos reales y puedo ofrecer con un alcance claro. Elige un servicio
        para ver qué incluye y dónde lo he hecho.
      </p>
      <ServicesExplorer services={services} types={serviceTypes} />
    </Section>
  )
}
