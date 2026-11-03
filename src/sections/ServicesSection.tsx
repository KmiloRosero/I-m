import { Section } from '@/components/ui/Section'
import { services } from '@/data/services'

export function ServicesSection() {
  return (
    <Section id="servicios" title="Servicios" titleAlign="end" tone="red">
      <p className="lead-text mt-6 max-w-text">
        Soy estudiante y desarrollador junior. Esto es lo que ya he hecho en proyectos reales y puedo
        ofrecer con un alcance claro.
      </p>
      <ul className="service-list">
        {services.map(({ description, evidence, title }) => (
          <li key={title}>
            <h3 className="service-title">{title}</h3>
            <p className="lead-text mt-3">{description}</p>
            <p className="mt-2">Ejemplos: {evidence.join(', ')}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
