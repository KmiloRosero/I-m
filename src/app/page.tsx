import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { AboutSection } from '@/components/sections/AboutSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TechnicalProfileSection } from '@/components/sections/TechnicalProfileSection'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <div id="page-content">
        <main id="contenido">
          <HeroSection />
          <TechnicalProfileSection />
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
