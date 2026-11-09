import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseInline } from './inlineMarkup.ts'

test('keeps plain text as one run', () => {
  assert.deepEqual(parseInline('Hola mundo'), [{ type: 'text', text: 'Hola mundo' }])
})

test('finds code spans and links in order', () => {
  assert.deepEqual(parseInline('Usa `compileAsync()` y lee [la guía](https://threejs.org/docs).'), [
    { type: 'text', text: 'Usa ' },
    { type: 'code', text: 'compileAsync()' },
    { type: 'text', text: ' y lee ' },
    { type: 'link', text: 'la guía', href: 'https://threejs.org/docs' },
    { type: 'text', text: '.' },
  ])
})

test('allows site-relative links', () => {
  assert.deepEqual(parseInline('[Proyectos](/#proyectos)'), [{ type: 'link', text: 'Proyectos', href: '/#proyectos' }])
})

test('never turns other schemes into links', () => {
  assert.deepEqual(parseInline('[clic](javascript:alert(1))'), [{ type: 'text', text: '[clic](javascript:alert(1))' }])
})
