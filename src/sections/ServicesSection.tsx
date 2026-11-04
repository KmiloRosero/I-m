import { ServicesExplorer } from '@/components/services/ServicesExplorer'
import { Section } from '@/components/ui/Section'
import { services, serviceTypes } from '@/data/services'

export function ServicesSection() {
  return (
    <Section id="servicios" title="Servicios" titleAlign="end" tone="red">
      <ServicesExplorer services={services} types={serviceTypes} />
    </Section>
  )
}
