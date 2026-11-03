import type { CSSProperties } from 'react'
import { Section } from '@/components/ui/Section'
import { FlowArt, FlowSection } from '@/components/ui/StoryScroll'
import { services } from '@/data/services'

const panelTones: readonly CSSProperties[] = [
  { backgroundColor: 'var(--color-cobalt)', color: 'var(--color-white)' },
  { backgroundColor: 'var(--color-yellow)', color: 'var(--color-black)' },
  { backgroundColor: 'var(--color-black)', color: 'var(--color-white)' },
  { backgroundColor: 'var(--color-white)', color: 'var(--color-black)' },
  { backgroundColor: 'var(--color-red)', color: 'var(--color-white)' },
]

export function ServicesSection() {
  return (
    <>
      <Section id="servicios" title="Servicios" titleAlign="end" tone="red">
        <p className="lead-text mt-6 max-w-text">
          Soy estudiante y desarrollador junior. Esto es lo que ya he hecho en proyectos reales y puedo
          ofrecer con un alcance claro.
        </p>
      </Section>
      <FlowArt aria-label="Servicios que ofrezco" navSectionId="servicios">
        {services.map(({ description, evidence, title }, index) => (
          <FlowSection aria-label={title} key={title} style={panelTones[index % panelTones.length]}>
            <h3 className="story-title">{title}</h3>
            <div className="max-w-text">
              <p className="lead-text">{description}</p>
              <p className="mt-3">Ejemplos: {evidence.join(', ')}</p>
            </div>
          </FlowSection>
        ))}
      </FlowArt>
    </>
  )
}
