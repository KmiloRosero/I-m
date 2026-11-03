import type { Testimonial } from '@/types/testimonial'

const IS_TESTIMONIALS_SECTION_ENABLED = true

const testimonials: readonly Testimonial[] = []

export const visibleTestimonials = IS_TESTIMONIALS_SECTION_ENABLED ? testimonials : []
