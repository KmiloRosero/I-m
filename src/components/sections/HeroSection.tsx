import Image from 'next/image'
import profilePhoto from '@/assets/images/profile/camilo-rosero.webp'
import { profile } from '@/data/profile'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-dvh flex-col justify-end gap-6 overflow-hidden bg-cobalt px-4 pt-24 pb-8 text-white sm:gap-8 sm:px-8 sm:pb-10"
      id="inicio"
    >
      <div className="flex flex-col gap-8 md:flex-row-reverse md:items-end md:justify-between">
        <div className="relative w-[clamp(10rem,48vw,15rem)] shrink-0 self-end md:w-[23vw] md:max-w-88">
          <div className="absolute inset-0 translate-x-2 translate-y-2 -rotate-2 bg-red sm:translate-x-4 sm:translate-y-4" />
          <Image
            alt={`Fotografía de ${profile.name}`}
            className="relative aspect-[3/4] w-full rotate-2 object-cover object-[50%_35%]"
            placeholder="blur"
            preload
            sizes="(min-width: 768px) 23vw, 48vw"
            src={profilePhoto}
          />
        </div>

        <h1
          className="text-[clamp(2.5rem,13.8vw,5.5rem)] leading-[0.86] font-extrabold tracking-tight [font-stretch:150%] md:text-[11.4vw] 2xl:text-[10.5rem]"
          id="hero-title"
        >
          <span className="block">Camilo</span>
          <span className="block">Rosero</span>
        </h1>
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <p className="max-w-[44ch] text-xl leading-snug sm:text-2xl">
          {profile.role}. {profile.semester} en la {profile.university}.
        </p>
        <ul className="flex flex-wrap gap-3">
          <li>
            <a
              className="block bg-yellow px-5 py-3 font-display font-bold text-black transition-transform duration-150 ease-(--ease-out-strong) active:scale-[0.97] motion-reduce:transition-none"
              href="#proyectos"
            >
              Ver proyectos
            </a>
          </li>
          <li>
            <a
              className="block bg-white px-5 py-3 font-display font-bold text-black transition-transform duration-150 ease-(--ease-out-strong) active:scale-[0.97] motion-reduce:transition-none"
              href="#contacto"
            >
              Contactarme
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
