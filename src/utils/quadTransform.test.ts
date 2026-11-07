import assert from 'node:assert/strict'
import { test } from 'node:test'
import { expandQuad, projectPoint, quadMatrix, type Quad } from './quadTransform.ts'

const screen: Quad = [
  { x: 656, y: 118 },
  { x: 1387, y: 34 },
  { x: 1301, y: 598 },
  { x: 565, y: 570 },
]

function close(actual: { x: number; y: number }, expected: { x: number; y: number }) {
  assert.ok(
    Math.abs(actual.x - expected.x) < 1e-6 && Math.abs(actual.y - expected.y) < 1e-6,
    `${JSON.stringify(actual)} ≠ ${JSON.stringify(expected)}`,
  )
}

test('the box corners land on the quad corners', () => {
  const matrix = quadMatrix(320, 180, screen)
  close(projectPoint(matrix, 0, 0), screen[0])
  close(projectPoint(matrix, 320, 0), screen[1])
  close(projectPoint(matrix, 320, 180), screen[2])
  close(projectPoint(matrix, 0, 180), screen[3])
})

test('a rectangle maps to itself', () => {
  const rect: Quad = [
    { x: 10, y: 20 },
    { x: 110, y: 20 },
    { x: 110, y: 70 },
    { x: 10, y: 70 },
  ]
  const matrix = quadMatrix(100, 50, rect)
  close(projectPoint(matrix, 50, 25), { x: 60, y: 45 })
})

test('expanding a quad moves every corner outward', () => {
  const grown = expandQuad(screen, 2)
  grown.forEach((point, index) => {
    const original = screen[index]!
    assert.ok(Math.abs(Math.hypot(point.x - original.x, point.y - original.y) - 2) < 1e-9)
  })
  assert.ok(grown[0].x < screen[0].x && grown[2].y > screen[2].y)
})
