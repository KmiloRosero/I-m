import type { Metadata } from 'next'
import { JsonLdScript } from '@/components/seo/JsonLdScript'
import { StoryScroll } from '@/components/ui/StoryScroll'
import { personalInfo } from '@/data/personalInfo'
import { AboutSection } from '@/sections/AboutSection'
import { ContactSection } from '@/sections/ContactSection'
import { ExperienceSection } from '@/sections/ExperienceSection'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { ServicesSection } from '@/sections/ServicesSection'
import { SkillsSection } from '@/sections/SkillsSection'
import { TestimonialsSection } from '@/sections/TestimonialsSection'
import { homeJsonLd } from '@/utils/structuredData'
import { siteUrl } from '@/utils/siteUrl'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function HomePage() {
  return (
    <main id="contenido">
      <JsonLdScript data={homeJsonLd(personalInfo, siteUrl, 'es')} />
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
