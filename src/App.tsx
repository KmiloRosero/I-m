import { SiteHeader } from './components/layout/SiteHeader'
import { ContactSection } from './components/sections/ContactSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProjectsSection } from './components/sections/ProjectsSection'

export function App() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <HeroSection />
        <ProjectsSection />
      </main>
      <ContactSection />
    </>
  )
}
