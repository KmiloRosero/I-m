'use client'

import { Check } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'
import { sendContactMessage } from '@/actions/contact'
import { useMessages } from '@/i18n/LocaleProvider'
import { CONTACT_LIMITS, type ContactField, type ContactState } from '@/utils/contactForm'

const INITIAL: ContactState = { status: 'idle' }
const FIELDS: readonly ContactField[] = ['name', 'email', 'message']

function MessageForm({ email, onReset }: { email: string; onReset: () => void }) {
  const copy = useMessages().contactForm
  const pathname = usePathname()
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL)
  const formRef = useRef<HTMLFormElement>(null)
  const startedRef = useRef<HTMLInputElement>(null)
  const sentRef = useRef<HTMLDivElement>(null)

  // When the visitor started, for the bot check; set after mount so server and client HTML match.
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now())
  }, [])

  // Errors: take the visitor to the first field to fix. Sent: announce it where focus lands.
  useEffect(() => {
    if (state.status === 'invalid') {
      const first = FIELDS.find((field) => state.errors[field])
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
    }
    if (state.status === 'sent') sentRef.current?.focus()
  }, [state])

  if (state.status === 'sent') {
    return (
      <div className="contact-form-sent" ref={sentRef} role="status" tabIndex={-1}>
        <span aria-hidden="true" className="contact-form-check">
          <Check />
        </span>
        <p className="contact-form-sent-title">{copy.sentTitle}</p>
        <p>{copy.sentBody}</p>
        <button className="contact-form-again" onClick={onReset} type="button">
          {copy.another}
        </button>
      </div>
    )
  }

  const values = state.status === 'invalid' || state.status === 'failed' ? state.values : null
  const errors = state.status === 'invalid' ? state.errors : {}
  const errorFor = (field: ContactField) => {
    const error = errors[field]
    return error ? (
      <p className="contact-form-error" id={`contact-${field}-error`}>
        {copy.errors[error]}
      </p>
    ) : null
  }
  const describedBy = (field: ContactField) => (errors[field] ? `contact-${field}-error` : undefined)

  return (
    <form action={formAction} className="contact-form" noValidate ref={formRef}>
      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor="contact-name">{copy.name}</label>
          <input
            aria-describedby={describedBy('name')}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            defaultValue={values?.name}
            id="contact-name"
            maxLength={CONTACT_LIMITS.name.max}
            name="name"
            required
            type="text"
          />
          {errorFor('name')}
        </div>
        <div className="contact-form-field">
          <label htmlFor="contact-email">{copy.email}</label>
          <input
            aria-describedby={describedBy('email')}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            defaultValue={values?.email}
            id="contact-email"
            inputMode="email"
            maxLength={CONTACT_LIMITS.email.max}
            name="email"
            required
            type="email"
          />
          {errorFor('email')}
        </div>
      </div>
      <div className="contact-form-field">
        <label htmlFor="contact-message">{copy.message}</label>
        <textarea
          aria-describedby={describedBy('message')}
          aria-invalid={Boolean(errors.message)}
          defaultValue={values?.message}
          id="contact-message"
          maxLength={CONTACT_LIMITS.message.max}
          name="message"
          required
          rows={6}
        />
        {errorFor('message')}
      </div>

      {/* For bots only: people never see or reach this field. */}
      <div aria-hidden="true" className="contact-form-trap">
        <label htmlFor="contact-website">Website</label>
        <input autoComplete="off" id="contact-website" name="website" tabIndex={-1} type="text" />
      </div>
      <input name="startedAt" ref={startedRef} type="hidden" />
      <input name="page" type="hidden" value={pathname} />

      <div className="contact-form-footer">
        <button className="button-link contact-form-submit" data-variant="primary" disabled={pending} type="submit">
          {pending ? copy.sending : copy.send}
        </button>
        <p aria-live="polite" className="contact-form-status">
          {state.status === 'failed' ? copy.failed(email) : null}
        </p>
      </div>
    </form>
  )
}

/** A short form that lands in my inbox; "send another" starts a fresh one. */
export function ContactForm({ email }: { email: string }) {
  const copy = useMessages().contactForm
  const [round, setRound] = useState(0)

  return (
    <section aria-labelledby="contact-form-title" className="contact-form-block">
      <div className="contact-form-intro">
        <h3 className="contact-form-heading" id="contact-form-title">
          {copy.heading}
        </h3>
        <p className="contact-form-lead">{copy.lead}</p>
      </div>
      <div className="contact-form-card">
        <MessageForm email={email} key={round} onReset={() => setRound((current) => current + 1)} />
      </div>
    </section>
  )
}
