import type { ReactNode } from 'react'
import { StorySection } from '@/components/ui/StorySection'

type SectionTone = 'black' | 'cobalt' | 'red' | 'white' | 'yellow'

interface SectionProps {
  children?: ReactNode
  id: string
  title: string
  titleAlign?: 'center' | 'end' | 'start'
  tone: SectionTone
}

const toneClasses: Record<SectionTone, string> = {
  black: 'bg-black text-white',
  cobalt: 'bg-cobalt text-white',
  red: 'bg-red text-white',
  white: 'bg-white text-black',
  yellow: 'bg-yellow text-black',
}

export function Section({ children, id, title, titleAlign = 'start', tone }: SectionProps) {
  const titleId = `${id}-title`

  return (
    <StorySection id={id}>
      <section aria-labelledby={titleId} className={`px-gutter py-section ${toneClasses[tone]}`}>
        <div className="mx-auto max-w-content">
          <h2 className="section-title" data-align={titleAlign} id={titleId}>
            {title}
          </h2>
          {children}
        </div>
      </section>
    </StorySection>
  )
}
