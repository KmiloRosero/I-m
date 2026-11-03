import { Section } from '@/components/ui/Section'
import { testimonials } from '@/data/testimonials'

export function TestimonialsSection() {
  if (testimonials.length === 0) return null

  return (
    <Section id="testimonios" title="Testimonios" tone="yellow">
      <ul className="mt-10 flex flex-col gap-10">
        {testimonials.map(({ context, name, quote, relationship }) => (
          <li key={name}>
            <figure>
              <blockquote className="lead-text max-w-text">{quote}</blockquote>
              <figcaption className="mt-3">
                {name}, {relationship}
                {context ? `. ${context}` : ''}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}
