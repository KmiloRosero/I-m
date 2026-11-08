import assert from 'node:assert/strict'
import { test } from 'node:test'
import { KEY_CODES, KEYBOARD_ROWS, ROW_UNITS, rowUnits } from './laptopKeyboard.ts'

test('every row of the keyboard is the same width', () => {
  for (const row of KEYBOARD_ROWS) assert.equal(rowUnits(row), ROW_UNITS, row.keys.map((key) => key.code).join(' '))
})

test('every key code is unique', () => {
  const count = KEYBOARD_ROWS.reduce((sum, row) => sum + row.keys.length, 0)
  assert.equal(KEY_CODES.size, count)
})

test('the letters, digits, WASD and arrows are all there', () => {
  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') assert.ok(KEY_CODES.has(`Key${letter}`), letter)
  for (let digit = 0; digit <= 9; digit += 1) assert.ok(KEY_CODES.has(`Digit${digit}`))
  for (const code of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'Backspace'])
    assert.ok(KEY_CODES.has(code), code)
  const accents = KEYBOARD_ROWS.flatMap((row) => row.keys.filter((key) => key.accent).map((key) => key.label))
  assert.deepEqual(accents.sort(), ['A', 'D', 'S', 'W'])
})
