import { MessageCircle } from 'lucide-react'
import { HeroLaptop } from '@/components/hero/HeroLaptop'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { MorphingText } from '@/components/ui/liquid-text'
import { NeuroNoiseBackground } from '@/components/ui/NeuroNoiseBackground'
import { StorySection } from '@/components/ui/StorySection'
import { personalInfo } from '@/data/personalInfo'

const heroTexts = [`${personalInfo.firstName}\n${personalInfo.lastName}`, ...personalInfo.heroRoles]

export function HeroSection() {
  return (
    <StorySection id="inicio">
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
        </div>

        <HeroLaptop />
      </section>
    </StorySection>
  )
}
