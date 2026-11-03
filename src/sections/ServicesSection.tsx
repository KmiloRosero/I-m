import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ServiceVisual } from '@/components/services/ServiceVisual'
import { Section } from '@/components/ui/Section'
import { StorySection } from '@/components/ui/StorySection'
import { projects } from '@/data/projects'
import { services } from '@/data/services'

type PanelTone = CSSProperties & Record<'--panel-ink' | '--panel-paper', string>

function createTone(paper: string, ink: string): PanelTone {
  return { backgroundColor: paper, color: ink, '--panel-ink': ink, '--panel-paper': paper }
}

const panelTones: readonly PanelTone[] = [
  createTone('var(--color-cobalt)', 'var(--color-white)'),
  createTone('var(--color-yellow)', 'var(--color-black)'),
  createTone('var(--color-black)', 'var(--color-white)'),
  createTone('var(--color-white)', 'var(--color-black)'),
  createTone('var(--color-red)', 'var(--color-white)'),
]

function EvidenceLink({ name }: { name: string }) {
  const project = projects.find((candidate) => candidate.name === name)
  if (!project?.hasCaseStudy) return <span className="service-chip">{name}</span>

  return (
    <Link className="service-chip" data-link="true" href={`/proyectos/${project.slug}`}>
      {name}
    </Link>
  )
}

export function ServicesSection() {
  return (
    <>
      <Section id="servicios" title="Servicios" titleAlign="end" tone="red">
        <p className="lead-text mt-6 max-w-text">
          Soy estudiante y desarrollador junior. Esto es lo que ya he hecho en proyectos reales y puedo
          ofrecer con un alcance claro.
        </p>
      </Section>
      {services.map(({ description, evidence, title, visual }, index) => (
        <StorySection
          innerClassName="story-panel"
          key={title}
          navSectionId="servicios"
          style={panelTones[index % panelTones.length]}
        >
          <div className="service-layout">
            <div className="service-copy">
              <h3 className="story-title">{title}</h3>
              <p className="service-description">{description}</p>
              <div>
                <p className="service-evidence-label">Lo he hecho en</p>
                <ul className="service-evidence">
                  {evidence.map((name) => (
                    <li key={name}>
                      <EvidenceLink name={name} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ServiceVisual visual={visual} />
          </div>
        </StorySection>
      ))}
    </>
  )
}
