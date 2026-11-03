import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createBlockTexture, type BlockType } from './blockTextures.ts'

const blockTypes: readonly BlockType[] = ['gold', 'grass', 'log', 'ore', 'stone']

function coveredPixels(dataUri: string): number {
  const svg = decodeURIComponent(dataUri.replace('data:image/svg+xml,', ''))
  return [...svg.matchAll(/width="(\d+)"/g)].reduce((total, [, width]) => total + Number(width), 0)
}

test('every block face is a full 16x16 SVG texture', () => {
  for (const type of blockTypes) {
    const { side, top } = createBlockTexture(type, 7)
    for (const face of [side, top]) {
      assert.ok(face.startsWith('data:image/svg+xml,'))
      assert.equal(coveredPixels(face), 256)
    }
  }
})

test('the same seed always produces the same texture', () => {
  assert.deepEqual(createBlockTexture('grass', 3), createBlockTexture('grass', 3))
})

test('different block types look different', () => {
  const sides = new Set(blockTypes.map((type) => createBlockTexture(type, 1).side))
  assert.equal(sides.size, blockTypes.length)
})
