import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSpring, isSpringSettled, nearestAngle, stepSpring } from './spring.ts'

test('a spring reaches its target and settles', () => {
  const spring = createSpring(0, 10)
  for (let i = 0; i < 600; i += 1) stepSpring(spring, 120, 14, 1 / 120)
  assert.ok(isSpringSettled(spring), JSON.stringify(spring))
})

test('an underdamped spring overshoots once on the way', () => {
  const spring = createSpring(0, 1)
  let max = 0
  for (let i = 0; i < 240; i += 1) {
    stepSpring(spring, 120, 8, 1 / 120)
    max = Math.max(max, spring.value)
  }
  assert.ok(max > 1.05, `max ${max}`)
})

test('angles take the short way round', () => {
  const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} vs ${b}`)
  close(nearestAngle(0, Math.PI / 2), Math.PI / 2)
  close(nearestAngle(0, (Math.PI * 3) / 2), -Math.PI / 2)
  close(nearestAngle(Math.PI * 4, 0.1), Math.PI * 4 + 0.1)
  close(nearestAngle(-0.1, Math.PI * 2 - 0.1), -0.1)
})
