import type { ReactNode } from 'react'
import { StorySection } from '@/components/ui/StorySection'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { sectionId, type SectionKey } from '@/i18n/paths'

type SectionTone = 'black' | 'cobalt' | 'red' | 'white' | 'yellow'

interface SectionProps {
  children?: ReactNode
  /** Which home-page section this is; its anchor id and title come from the language. */
  section: SectionKey
  locale: Locale
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

export function Section({ children, locale, section, titleAlign = 'start', tone }: SectionProps) {
  const id = sectionId(section, locale)
  const titleId = `${id}-title`

  return (
    <StorySection id={id}>
      <section aria-labelledby={titleId} className={`px-gutter py-section ${toneClasses[tone]}`}>
        <div className="mx-auto max-w-content">
          <h2 className="section-title" data-align={titleAlign} id={titleId}>
            {getMessages(locale).sections[section]}
          </h2>
          {children}
        </div>
      </section>
    </StorySection>
  )
}
