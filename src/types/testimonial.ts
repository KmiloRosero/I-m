export interface Testimonial {
  name: string
  relationship: string
  quote: string
  context: string | null
  technologies: readonly string[]
}
