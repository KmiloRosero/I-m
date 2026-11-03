import { Section } from '@/components/ui/Section'
import { visibleTestimonials } from '@/data/testimonials'

export function TestimonialsSection() {
  if (visibleTestimonials.length === 0) return null

  return (
    <Section id="testimonios" title="Testimonios" tone="yellow">
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
