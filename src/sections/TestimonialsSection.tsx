import { Section } from '@/components/ui/Section'
import { visibleTestimonials } from '@/data/testimonials'
import type { Locale } from '@/i18n/config'

export function TestimonialsSection({ locale }: { locale: Locale }) {
  if (visibleTestimonials.length === 0) return null

  return (
    <Section locale={locale} section="testimonials" tone="yellow">
      <ul className="testimonial-list">
        {visibleTestimonials.map(({ context, name, quote, relationship, technologies }) => (
          <li key={name}>
            <figure>
              <blockquote className="testimonial-quote">{quote}</blockquote>
              <figcaption className="mt-5">
                <p className="font-display font-bold">{name}</p>
                <p>{relationship}</p>
                {context ? <p>{context}</p> : null}
                {technologies.length > 0 ? <p>{technologies.join(', ')}</p> : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}
