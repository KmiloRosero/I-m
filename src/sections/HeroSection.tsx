import Image from 'next/image'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { personalInfo } from '@/data/personalInfo'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-dvh flex-col justify-end overflow-hidden bg-cobalt px-gutter pt-24 pb-8 text-white sm:pb-10"
      id="inicio"
    >
      <div className="mx-auto flex w-full max-w-content flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-8 md:flex-row-reverse md:items-end md:justify-between">
          <div className="relative w-[clamp(10rem,48vw,15rem)] shrink-0 self-end md:w-[23vw] md:max-w-88">
            <div className="absolute inset-0 translate-x-2 translate-y-2 -rotate-2 bg-red sm:translate-x-4 sm:translate-y-4" />
            <Image
              alt={`Fotografía de ${personalInfo.name}`}
              className="relative aspect-[3/4] w-full rotate-2 object-cover object-[50%_35%]"
              height={1280}
              preload
              sizes="(min-width: 768px) 23vw, 48vw"
              src="/images/profile/camilo-rosero.webp"
              width={876}
            />
          </div>

          <h1 className="display-name" id="hero-title">
            <span className="block">Camilo</span>
            <span className="block">Rosero</span>
          </h1>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <p className="lead-text max-w-[44ch]">
            {personalInfo.role}. {personalInfo.semester} en la {personalInfo.university}.
          </p>
          <ul className="flex flex-wrap gap-3">
            <li>
              <ButtonLink href="#proyectos" variant="primary">
                Ver proyectos
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
