import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Lanyard, strapPath } from './lanyardPhysics.ts'

const layout = { anchor: { x: 200, y: -60 }, clip: { x: 200, y: 240 }, badgeHeight: 400 }

function settle(lanyard: Lanyard, seconds = 12) {
  for (let elapsed = 0; elapsed < seconds; elapsed += 1 / 60) lanyard.advance(1 / 60)
}

test('a badge released off to the side swings back to hang straight', () => {
  const lanyard = new Lanyard(layout, { x: 360, y: 160 })
  settle(lanyard)
  assert.ok(Math.abs(lanyard.clip.x - 200) < 2, `clip x ${lanyard.clip.x}`)
  assert.ok(Math.abs(lanyard.clip.y - 240) < 4, `clip y ${lanyard.clip.y}`)
  assert.ok(Math.abs(lanyard.angle) < 0.03, `angle ${lanyard.angle}`)
})

test('a dragged badge keeps the gripped point under the pointer', () => {
  const lanyard = new Lanyard(layout)
  const grip = lanyard.gripAt({ x: 260, y: 400 })
  lanyard.grab(grip, { x: 320, y: 380 })
  settle(lanyard, 1)
  const after = lanyard.gripAt({ x: 320, y: 380 })
  assert.ok(Math.abs(after.along - grip.along) < 1 && Math.abs(after.across - grip.across) < 1)
})

test('a drag cannot pull the strap far past its length', () => {
  const lanyard = new Lanyard(layout)
  lanyard.grab(lanyard.gripAt(layout.clip), { x: 200, y: 4000 })
  settle(lanyard, 1)
  assert.ok(lanyard.clip.y < 240 + 300 * 0.2, `clip y ${lanyard.clip.y}`)
})

test('the strap path starts at the anchor and ends at the clip', () => {
  const lanyard = new Lanyard(layout)
  const path = strapPath(lanyard)
  assert.ok(path.startsWith('M200.0 -60.0'))
  assert.ok(path.endsWith('L200.0 240.0'))
})
