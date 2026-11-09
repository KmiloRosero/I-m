'use server'

import { getPersonalInfo } from '@/data/personalInfo'
import { looksLikeBot, validateContact, type ContactState } from '@/utils/contactForm'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
/** Resend's shared sender works without a verified domain, for the account's own address. */
const DEFAULT_SENDER = 'Portafolio <onboarding@resend.dev>'

/**
 * Sends the visitor's message to my inbox through Resend, with their address as
 * Reply-To. The key never leaves the server.
 */
export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  // A bot's message "goes through", so it learns nothing about the check.
  if (looksLikeBot({ honeypot: formData.get('website'), startedAt: formData.get('startedAt'), now: Date.now() })) {
    return { status: 'sent' }
  }

  const result = validateContact({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })
  if (!result.ok) return { status: 'invalid', values: result.values, errors: result.errors }

  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) return { status: 'failed', values: result.values }

  const { name, email, message } = result.values
  const page = String(formData.get('page') ?? '')
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env['CONTACT_FROM_EMAIL'] ?? DEFAULT_SENDER,
        to: [process.env['CONTACT_TO_EMAIL'] ?? getPersonalInfo('es').email],
        reply_to: email,
        subject: `Nuevo mensaje del portafolio: ${name}`,
        text: [`Nombre: ${name}`, `Correo: ${email}`, page ? `Página: ${page}` : null, '', message]
          .filter((line) => line !== null)
          .join('\n'),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      console.error(`Contact form: Resend answered ${response.status}`)
      return { status: 'failed', values: result.values }
    }
    return { status: 'sent' }
  } catch (error) {
    console.error('Contact form: could not reach Resend', error instanceof Error ? error.message : error)
    return { status: 'failed', values: result.values }
  }
}
