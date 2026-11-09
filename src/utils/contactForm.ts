export type ContactField = 'name' | 'email' | 'message'

export type ContactError = 'required' | 'tooShort' | 'tooLong' | 'invalidEmail'

export interface ContactValues {
  name: string
  email: string
  message: string
}

export type ContactValidation =
  | { ok: true; values: ContactValues }
  | { ok: false; values: ContactValues; errors: Partial<Record<ContactField, ContactError>> }

/** What the form shows after each submission. */
export type ContactState =
  | { status: 'idle' }
  | { status: 'invalid'; values: ContactValues; errors: Partial<Record<ContactField, ContactError>> }
  | { status: 'sent' }
  | { status: 'failed'; values: ContactValues }

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 4000 },
} as const

/** Seconds a person needs at least to fill the form; faster submissions are bots. */
export const MIN_FILL_SECONDS = 3

// Deliberately simple: something@something.tld, no spaces. The mail service has the final word.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/** Checks the three fields; returns the cleaned values either way, so the form can show them again. */
export function validateContact(input: Record<ContactField, unknown>): ContactValidation {
  const values: ContactValues = {
    name: text(input.name).replace(/\s+/g, ' '),
    email: text(input.email).toLowerCase(),
    message: text(input.message),
  }
  const errors: Partial<Record<ContactField, ContactError>> = {}

  if (!values.name) errors.name = 'required'
  else if (values.name.length < CONTACT_LIMITS.name.min) errors.name = 'tooShort'
  else if (values.name.length > CONTACT_LIMITS.name.max) errors.name = 'tooLong'

  if (!values.email) errors.email = 'required'
  else if (values.email.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(values.email)) errors.email = 'invalidEmail'

  if (!values.message) errors.message = 'required'
  else if (values.message.length < CONTACT_LIMITS.message.min) errors.message = 'tooShort'
  else if (values.message.length > CONTACT_LIMITS.message.max) errors.message = 'tooLong'

  return Object.keys(errors).length > 0 ? { ok: false, values, errors } : { ok: true, values }
}

/**
 * Bots fill every field, including the hidden one people never see, and submit
 * the moment the page loads.
 */
export function looksLikeBot({ honeypot, startedAt, now }: { honeypot: unknown; startedAt: unknown; now: number }): boolean {
  if (text(honeypot)) return true
  const started = Number(startedAt)
  return !Number.isFinite(started) || now - started < MIN_FILL_SECONDS * 1000
}
