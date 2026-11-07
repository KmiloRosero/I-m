import assert from 'node:assert/strict'
import { test } from 'node:test'
import { LaptopBody, rubberBand } from './laptopPhysics.ts'

function run(body: LaptopBody, seconds: number, onFrame?: (time: number) => void) {
  for (let time = 0; time < seconds; time += 1 / 60) {
    onFrame?.(time)
    body.advance(1 / 60)
  }
}

test('a thrown laptop springs back and comes to rest at its place', () => {
  const body = new LaptopBody({ x: 180, y: -140, vx: 900, angle: 10 })
  run(body, 6)
  assert.ok(body.atRest, `still moving at ${JSON.stringify(body.position)}`)
  body.settle()
  assert.deepEqual(body.position, { x: 0, y: 0 })
  assert.equal(body.angle, 0)
})

test('it overshoots on the way back, like a spring with weight', () => {
  const body = new LaptopBody({ x: 120 })
  let minX = Infinity
  run(body, 2, () => (minX = Math.min(minX, body.position.x)))
  assert.ok(minX < -2, `min x ${minX}`)
})

test('a dragged laptop follows the pointer, keeping the grab offset', () => {
  const body = new LaptopBody()
  body.setReach({ x: 1000, y: 1000 })
  body.grab({ x: 30, y: 10 })
  body.moveTo({ x: 90, y: 40 })
  run(body, 1)
  assert.ok(Math.abs(body.position.x - 60) < 1.5, `x ${body.position.x}`)
  assert.ok(Math.abs(body.position.y - 30) < 1.5, `y ${body.position.y}`)
  assert.equal(body.atRest, false)
})

test('a drag cannot pull it past its reach', () => {
  const body = new LaptopBody()
  body.setReach({ x: 200, y: 100 })
  body.grab({ x: 0, y: 0 })
  body.moveTo({ x: 5000, y: -5000 })
  run(body, 1)
  assert.ok(body.position.x <= 200 && body.position.x > 150, `x ${body.position.x}`)
  assert.ok(body.position.y >= -100 && body.position.y < -75, `y ${body.position.y}`)
})

test('shaking it sideways makes it sway, within its limit', () => {
  const body = new LaptopBody()
  body.grab({ x: 0, y: 0 })
  let maxSway = 0
  run(body, 1.5, (time) => {
    body.moveTo({ x: 120 * Math.sin(time * Math.PI * 3), y: 0 })
    maxSway = Math.max(maxSway, Math.abs(body.angle))
  })
  assert.ok(maxSway > 4 && maxSway <= 16, `sway ${maxSway}`)
})

test('it leans toward the hover point', () => {
  const body = new LaptopBody()
  body.hover({ x: 1, y: -1 })
  run(body, 2)
  assert.ok(body.tilt.y > 6 && body.tilt.x > 6, JSON.stringify(body.tilt))
  assert.ok(body.atRest)
})

test('a hop lifts it and it lands back', () => {
  const body = new LaptopBody()
  body.hop()
  let minY = 0
  run(body, 5, () => (minY = Math.min(minY, body.position.y)))
  assert.ok(minY < -10, `min y ${minY}`)
  assert.ok(body.atRest)
})

test('the rubber band is 1:1 near zero and never passes its reach', () => {
  assert.equal(rubberBand(80, 200), 80)
  assert.ok(rubberBand(150, 200) > 135 && rubberBand(150, 200) < 150)
  assert.ok(rubberBand(10_000, 200) <= 200)
  assert.ok(rubberBand(-10_000, 200) >= -200)
})
