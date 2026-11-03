import { ContourField } from '@/components/terrain/ContourField'
import { SectionShell } from '@/components/ui/SectionShell'

export function AboutSection() {
  return (
    <SectionShell id="sobre-mi" title="Sobre mí" tone="yellow">
      <ContourField />
    </SectionShell>
  )
}
