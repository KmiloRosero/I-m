import { profile } from '@/data/profile'
import { ContourField } from '@/components/terrain/ContourField'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden px-4 pb-8 pt-24 sm:px-8 sm:pb-10"
      id="inicio"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-[72%]">
        <ContourField />
        <div className="absolute inset-0 bg-linear-to-t from-night via-transparent via-45% to-transparent" />
      </div>

      <h1
        className="text-[clamp(3.25rem,15.5vw,14rem)] leading-[0.86] font-extrabold tracking-tight [font-stretch:150%]"
        id="hero-title"
      >
        <span className="block">Camilo</span>
        <span className="block">Rosero</span>
      </h1>

      <div className="mt-6 flex max-w-[1400px] flex-col gap-4 sm:mt-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-[46ch] text-xl leading-snug sm:text-2xl">
          {profile.role}, {profile.semester.toLowerCase()} en la {profile.university}. Hago
          aplicaciones web, móviles, de escritorio y para reloj.
        </p>
        <p className="max-w-[34ch] text-base text-mist md:text-right">
          Al fondo, el volcán Galeras, junto a Pasto: curvas de nivel reales, cada 200 metros.
        </p>
      </div>
    </section>
  )
}
