import type { Metadata } from 'next'
import { StoryScroll } from '@/components/ui/StoryScroll'
import { AboutSection } from '@/sections/AboutSection'
import { ContactSection } from '@/sections/ContactSection'
import { ExperienceSection } from '@/sections/ExperienceSection'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { ServicesSection } from '@/sections/ServicesSection'
import { SkillsSection } from '@/sections/SkillsSection'
import { TestimonialsSection } from '@/sections/TestimonialsSection'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function HomePage() {
  return (
    <main id="contenido">
      <StoryScroll>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ExperienceSection />
        <ContactSection />
      </StoryScroll>
    </main>
  )
}
