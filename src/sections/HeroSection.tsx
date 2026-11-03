import { ProfileFlipCard } from '@/components/common/ProfileFlipCard'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { personalInfo } from '@/data/personalInfo'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-cobalt px-gutter pt-24 pb-10 text-white"
      id="inicio"
    >
      <div aria-hidden="true" className="hero-band" />

      <div className="relative mx-auto flex w-full max-w-content flex-col gap-10 lg:flex-row-reverse lg:items-end lg:justify-between">
        <div className="hero-card-enter w-full max-w-md self-end lg:w-[28vw] lg:max-w-104 lg:shrink-0">
          <ProfileFlipCard />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8">
          <h1 className="display-name" id="hero-title">
            <span className="hero-rise block [--hero-delay:80ms]">Camilo</span>
            <span className="hero-rise block [--hero-delay:140ms]">Rosero</span>
          </h1>
          <p className="lead-text hero-rise max-w-[44ch] [--hero-delay:220ms]">
            {personalInfo.studies} y {personalInfo.position.toLowerCase()}.{' '}
            {personalInfo.semester} en la {personalInfo.university}.
          </p>
          <ul className="hero-rise flex flex-wrap gap-3 [--hero-delay:280ms]">
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
  )
}
