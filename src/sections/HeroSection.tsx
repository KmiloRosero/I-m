import { MessageCircle } from 'lucide-react'
import { ProfileFlipCard } from '@/components/common/ProfileFlipCard'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { MorphingText } from '@/components/ui/liquid-text'
import { NeuroNoiseBackground } from '@/components/ui/NeuroNoiseBackground'
import { StorySection } from '@/components/ui/StorySection'
import { personalInfo } from '@/data/personalInfo'

// Palette for the band beside the photo, low → high.
const HERO_BAND_COLORS = ['#000000', '#8A0B0B', '#FF2A1F', '#FFE8E3']

const heroTexts = [`${personalInfo.firstName}\n${personalInfo.lastName}`, ...personalInfo.heroRoles]

export function HeroSection() {
  return (
    <StorySection id="inicio">
      <section
        aria-labelledby="hero-title"
        className="hero relative flex min-h-dvh flex-col justify-end overflow-hidden bg-cobalt px-gutter pt-24 pb-10 text-white"
      >
        {/* Only the blue area: the red band sits under the photo, at the bottom on
            mobile and on the right 34% on desktop. */}
        <NeuroNoiseBackground className="bottom-64 lg:bottom-0 lg:right-[34%]" />
        <div aria-hidden="true" className="hero-band">
          <NeuroNoiseBackground colors={HERO_BAND_COLORS} />
        </div>

        {/* Name first in reading order, so phones open on it; desktop keeps the photo on the right. */}
        <div className="relative mx-auto flex w-full max-w-content flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="hero-copy flex min-w-0 flex-col items-center gap-7 text-center sm:gap-9 lg:flex-1 lg:self-center">
            <p className="hero-status hero-rise [--hero-delay:60ms]">
              <span aria-hidden="true" className="hero-status-dot" />
              {personalInfo.availability}
            </p>
            <h1 className="hero-morph w-full" id="hero-title">
              <span className="sr-only">
                {personalInfo.name}, {personalInfo.title}
              </span>
              <MorphingText
                firstHoldTime={3.4}
                innerClassName="liquid-enter"
                lines={2}
                texts={heroTexts}
              />
            </h1>
            <ul className="hero-rise flex flex-wrap justify-center gap-3 [--hero-delay:700ms]">
              <li>
                <ButtonLink href="#proyectos" variant="primary">
                  Ver proyectos
                </ButtonLink>
              </li>
              <li>
                <ButtonLink href="#sobre-mi" variant="secondary">
                  Sobre mí
                </ButtonLink>
              </li>
              <li>
                {personalInfo.whatsappUrl ? (
                  <a
                    className="button-link hero-whatsapp"
                    data-variant="secondary"
                    href={personalInfo.whatsappUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MessageCircle aria-hidden="true" className="size-5" />
                    Escríbeme por WhatsApp
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                ) : (
                  <ButtonLink href="#contacto" variant="secondary">
                    Contactarme
                  </ButtonLink>
                )}
              </li>
            </ul>
          </div>

          <div className="hero-card-enter w-full max-w-md self-center sm:self-end lg:w-[28vw] lg:max-w-104 lg:shrink-0">
            <ProfileFlipCard />
          </div>
        </div>
      </section>
    </StorySection>
  )
}
