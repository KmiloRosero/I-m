import { MessageCircle } from 'lucide-react'
import { HeroLaptop, type LaptopProfile } from '@/components/hero/HeroLaptop'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { MorphingText } from '@/components/ui/liquid-text'
import { NeuroNoiseBackground } from '@/components/ui/NeuroNoiseBackground'
import { StorySection } from '@/components/ui/StorySection'
import { getPersonalInfo } from '@/data/personalInfo'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { sectionId } from '@/i18n/paths'
import { getCvLinks } from '@/utils/professionalLinks'

export function HeroSection({ locale }: { locale: Locale }) {
  const info = getPersonalInfo(locale)
  const messages = getMessages(locale)
  const copy = messages.hero
  const heroTexts = [`${info.firstName}\n${info.lastName}`, ...info.heroRoles]
  const profile: LaptopProfile = {
    name: info.name,
    title: info.title,
    meta: `${info.position} · ${info.location.split(',')[0]}, CO`,
    stack: info.featuredStack.slice(0, 4),
    links: [...info.socialLinks, ...getCvLinks(locale)],
    photoSrc: info.photoSrc,
    modelLabel: copy.laptopModel(info.name),
    photoAlt: copy.laptopPhoto(info.name),
    opensInNewTab: messages.common.opensInNewTab,
    screen: { ...copy.screen, address: copy.screen.address(info.firstName.toLowerCase()) },
  }

  return (
    <StorySection id={sectionId('home', locale)}>
      <section
        aria-labelledby="hero-title"
        className="hero relative flex min-h-dvh flex-col justify-end overflow-hidden bg-cobalt px-gutter pt-24 pb-10 text-white"
      >
        <NeuroNoiseBackground />

        {/* Name first in reading order, so phones open on it; from lg the laptop
            floats on the right side of the hero. */}
        <div className="relative mx-auto flex w-full max-w-content flex-col gap-4 lg:min-h-[calc(100dvh-8.5rem)] lg:justify-center">
          <div className="hero-copy flex min-w-0 flex-col items-center gap-7 text-center sm:gap-9 lg:w-[56%]">
            <p className="hero-status hero-rise [--hero-delay:60ms]">
              <span aria-hidden="true" className="hero-status-dot" />
              {info.availability}
            </p>
            <h1 className="hero-morph w-full" id="hero-title">
              <span className="sr-only">
                {info.name}, {info.title}
              </span>
              <MorphingText firstHoldTime={3.4} innerClassName="liquid-enter" lines={2} texts={heroTexts} />
            </h1>
            <ul className="hero-rise relative z-10 flex flex-wrap justify-center gap-3 [--hero-delay:700ms]">
              <li>
                <ButtonLink href={`#${sectionId('projects', locale)}`} variant="primary">
                  {copy.viewProjects}
                </ButtonLink>
              </li>
              <li>
                <ButtonLink href={`#${sectionId('about', locale)}`} variant="secondary">
                  {copy.aboutMe}
                </ButtonLink>
              </li>
              <li>
                {info.whatsappUrl ? (
                  <a
                    className="button-link hero-whatsapp"
                    data-variant="secondary"
                    href={info.whatsappUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MessageCircle aria-hidden="true" className="size-5" />
                    {copy.whatsapp}
                    <span className="sr-only">{messages.common.opensInNewTab}</span>
                  </a>
                ) : (
                  <ButtonLink href={`#${sectionId('contact', locale)}`} variant="secondary">
                    {copy.contactMe}
                  </ButtonLink>
                )}
              </li>
            </ul>
          </div>
        </div>

        <HeroLaptop profile={profile} />
      </section>
    </StorySection>
  )
}
