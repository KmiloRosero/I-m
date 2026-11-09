import { ServiceProcess } from '@/components/services/ServiceProcess'
import { ServicesExplorer } from '@/components/services/ServicesExplorer'
import { Section } from '@/components/ui/Section'
import { getServices, getServiceTypes } from '@/data/services'
import type { Locale } from '@/i18n/config'

export function ServicesSection({ locale }: { locale: Locale }) {
  return (
    <Section locale={locale} section="services" titleAlign="end" tone="red">
      <ServicesExplorer services={getServices(locale)} types={getServiceTypes(locale)} />
      <ServiceProcess locale={locale} />
    </Section>
  )
}
