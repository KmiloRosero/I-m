import { JsonLdScript } from '@/components/seo/JsonLdScript'
import { StoryScroll } from '@/components/ui/StoryScroll'
import { getPersonalInfo } from '@/data/personalInfo'
import type { Locale } from '@/i18n/config'
import { AboutSection } from '@/sections/AboutSection'
import { ContactSection } from '@/sections/ContactSection'
import { ExperienceSection } from '@/sections/ExperienceSection'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { ServicesSection } from '@/sections/ServicesSection'
import { SkillsSection } from '@/sections/SkillsSection'
import { TestimonialsSection } from '@/sections/TestimonialsSection'
import { siteUrl } from '@/utils/siteUrl'
import { homeJsonLd } from '@/utils/structuredData'

export function HomeView({ locale }: { locale: Locale }) {
  return (
    <main id="contenido">
      <JsonLdScript data={homeJsonLd(getPersonalInfo(locale), siteUrl, locale)} />
      <StoryScroll>
        <HeroSection locale={locale} />
        <AboutSection locale={locale} />
        <SkillsSection locale={locale} />
        <ServicesSection locale={locale} />
        <ProjectsSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <ExperienceSection locale={locale} />
        <ContactSection locale={locale} />
      </StoryScroll>
    </main>
  )
}
