import assert from 'node:assert/strict'
import { test } from 'node:test'
import { looksLikeBot, validateContact } from './contactForm.ts'

const valid = { name: '  Ana   María ', email: ' Ana@Example.COM ', message: 'Quiero un sitio para mi panadería.' }

test('accepts a complete message and cleans it up', () => {
  assert.deepEqual(validateContact(valid), {
    ok: true,
    values: { name: 'Ana María', email: 'ana@example.com', message: 'Quiero un sitio para mi panadería.' },
  })
})

test('flags each missing or malformed field', () => {
  const result = validateContact({ name: '', email: 'ana@', message: 'Hola' })
  assert.equal(result.ok, false)
  assert.deepEqual(!result.ok && result.errors, { name: 'required', email: 'invalidEmail', message: 'tooShort' })
})

test('keeps what was typed so the form can show it again', () => {
  const result = validateContact({ ...valid, email: 'not-an-email' })
  assert.equal(result.values.message, valid.message.trim())
})

test('rejects messages over the limit', () => {
  const result = validateContact({ ...valid, message: 'a'.repeat(4001) })
  assert.deepEqual(!result.ok && result.errors, { message: 'tooLong' })
})

test('treats non-string input as empty', () => {
  const result = validateContact({ name: 42, email: null, message: undefined })
  assert.deepEqual(!result.ok && result.errors, { name: 'required', email: 'required', message: 'required' })
})

test('spots bots by the hidden field or by an instant submit', () => {
  const now = 100_000
  assert.equal(looksLikeBot({ honeypot: 'https://spam.example', startedAt: 0, now }), true)
  assert.equal(looksLikeBot({ honeypot: '', startedAt: now - 1_000, now }), true)
  assert.equal(looksLikeBot({ honeypot: '', startedAt: 'nope', now }), true)
  assert.equal(looksLikeBot({ honeypot: '', startedAt: now - 20_000, now }), false)
})
