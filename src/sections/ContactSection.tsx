import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { Section } from '@/components/ui/Section'
import { getProfessionalLinks } from '@/utils/professionalLinks'

export function ContactSection() {
  return (
    <Section id="contacto" title="Contacto" tone="cobalt">
      <ul className="mt-10 flex flex-col gap-2 text-2xl">
        {getProfessionalLinks().map((link) => (
          <li key={link.url}>
            <ExternalAwareLink {...link} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
