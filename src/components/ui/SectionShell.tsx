import type { ReactNode } from 'react'

type SectionTone = 'black' | 'cobalt' | 'red' | 'white' | 'yellow'

interface SectionShellProps {
  children?: ReactNode
  id: string
  title: string
  tone: SectionTone
}

const toneClasses: Record<SectionTone, string> = {
  black: 'bg-black text-white',
  cobalt: 'bg-cobalt text-white',
  red: 'bg-red text-white',
  white: 'bg-white text-black',
  yellow: 'bg-yellow text-black',
}

export function SectionShell({ children, id, title, tone }: SectionShellProps) {
  const titleId = `${id}-title`

  return (
    <section
      aria-labelledby={titleId}
      className={`min-h-[70dvh] px-4 py-16 sm:px-8 sm:py-24 ${toneClasses[tone]}`}
      id={id}
    >
      <h2
        className="text-[clamp(2.25rem,10vw,6.5rem)] leading-none font-extrabold tracking-tight [font-stretch:115%] sm:text-[min(8.4vw,6.5rem)] sm:[font-stretch:150%]"
        id={titleId}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
