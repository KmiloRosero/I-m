import { ProfileFlipCard } from '@/components/common/ProfileFlipCard'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { MorphingText } from '@/components/ui/liquid-text'
import { StorySection } from '@/components/ui/StorySection'
import { personalInfo } from '@/data/personalInfo'

export function HeroSection() {
  return (
    <StorySection id="inicio">
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-cobalt px-gutter pt-24 pb-10 text-white"
      >
        <div aria-hidden="true" className="hero-band" />

        <div className="relative mx-auto flex w-full max-w-content flex-col gap-10 lg:flex-row-reverse lg:items-end lg:justify-between">
          <div className="hero-card-enter w-full max-w-md self-end lg:w-[28vw] lg:max-w-104 lg:shrink-0">
            <ProfileFlipCard />
          </div>

          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="flex flex-col gap-4 sm:gap-5">
              <h1 className="display-name" id="hero-title">
                <span className="liquid-in [--liquid-delay:120ms]">
                  <span>{personalInfo.firstName}</span>
                </span>
                <span className="liquid-in [--liquid-delay:320ms]">
                  <span>{personalInfo.lastName}</span>
                </span>
                <span className="sr-only">, {personalInfo.title}</span>
              </h1>
              <div className="hero-role-row hero-rise [--hero-delay:760ms]">
                <span aria-hidden="true" className="hero-role-rule" />
                <MorphingText className="hero-role" texts={personalInfo.heroRoles} />
              </div>
            </div>
            <svg aria-hidden="true" className="absolute size-0" focusable="false">
              <defs>
                <filter height="200%" id="hero-liquid" width="140%" x="-20%" y="-50%">
                  <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
                  />
                </filter>
              </defs>
            </svg>
            <ul className="hero-rise flex flex-wrap gap-3 [--hero-delay:900ms]">
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
                <ButtonLink href="#contacto" variant="secondary">
                  Contactarme
                </ButtonLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </StorySection>
  )
}
