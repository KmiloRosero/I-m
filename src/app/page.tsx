import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { AboutSection } from '@/sections/AboutSection'
import { ContactSection } from '@/sections/ContactSection'
import { ExperienceSection } from '@/sections/ExperienceSection'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { ServicesSection } from '@/sections/ServicesSection'
import { SkillsSection } from '@/sections/SkillsSection'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <div id="page-content">
        <main id="contenido">
          <HeroSection />
          <SkillsSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </>
  )
}
