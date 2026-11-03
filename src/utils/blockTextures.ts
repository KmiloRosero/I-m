export type BlockType = 'gold' | 'grass' | 'log' | 'ore' | 'stone'

interface BlockTexture {
  side: string
  top: string
}

type Pixels = string[][]

const SIZE = 16

const STONE = ['#7f7f7f', '#8c8c8c', '#747474', '#999999']
const DIRT = ['#866043', '#966c4a', '#79553a', '#6b4a31']
const GRASS = ['#5f9e35', '#70b23f', '#4e8a2c', '#83c24c']
const ORE = { light: '#9ff5ef', mid: '#3fc6c0', shadow: '#1f7f7b' }
const GOLD = { base: ['#f5d43b', '#fbe363', '#ecc52e'], dark: '#b8870f', light: '#fff4a8' }
const BARK = ['#6b5132', '#5a4229', '#7a5c39', '#4d3822']
const RINGS = ['#c19c63', '#a9844f']

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(items: readonly T[], random: () => number): T {
  const item = items[Math.floor(random() * items.length)]
  if (item === undefined) throw new Error('Empty palette')
  return item
}

function fill(palette: readonly string[], random: () => number): Pixels {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => pick(palette, random)))
}

function setPixel(pixels: Pixels, x: number, y: number, color: string) {
  const row = pixels[y]
  if (row && x >= 0 && x < SIZE) row[x] = color
}

function toDataUri(pixels: Pixels): string {
  const rects = pixels.flatMap((row, y) => {
    const runs: string[] = []
    let start = 0
    for (let x = 1; x <= SIZE; x += 1) {
      if (x === SIZE || row[x] !== row[start]) {
        runs.push(`<rect x="${start}" y="${y}" width="${x - start}" height="1" fill="${row[start]}"/>`)
        start = x
      }
    }
    return runs
  })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="crispEdges">${rects.join('')}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function stone(random: () => number): Pixels {
  const pixels = fill(STONE, random)
  for (let streak = 0; streak < 6; streak += 1) {
    const x = Math.floor(random() * SIZE)
    const y = Math.floor(random() * SIZE)
    for (let offset = 0; offset < 3; offset += 1) setPixel(pixels, x + offset, y, '#666666')
  }
  return pixels
}

function ore(random: () => number): Pixels {
  const pixels = stone(random)
  const veins = [
    [2, 3],
    [10, 2],
    [6, 8],
    [12, 11],
    [3, 12],
  ] as const
  veins.forEach(([x, y]) => {
    setPixel(pixels, x, y, ORE.light)
    setPixel(pixels, x + 1, y, ORE.mid)
    setPixel(pixels, x, y + 1, ORE.mid)
    setPixel(pixels, x + 1, y + 1, ORE.shadow)
    if (random() > 0.5) setPixel(pixels, x + 2, y + 1, ORE.mid)
  })
  return pixels
}

function grassSide(random: () => number): Pixels {
  const pixels = fill(DIRT, random)
  pixels.forEach((row, y) => {
    row.forEach((_, x) => {
      const overhang = y === 3 ? random() < 0.65 : y === 4 ? random() < 0.3 : y === 5 && random() < 0.08
      if (y < 3 || overhang) setPixel(pixels, x, y, pick(GRASS, random))
    })
  })
  return pixels
}

function gold(random: () => number): Pixels {
  const pixels = fill(GOLD.base, random)
  for (let index = 0; index < SIZE; index += 1) {
    setPixel(pixels, index, 0, GOLD.light)
    setPixel(pixels, 0, index, GOLD.light)
    setPixel(pixels, index, SIZE - 1, GOLD.dark)
    setPixel(pixels, SIZE - 1, index, GOLD.dark)
  }
  for (let shine = 0; shine < 5; shine += 1) {
    setPixel(pixels, 2 + Math.floor(random() * 11), 2 + Math.floor(random() * 11), GOLD.light)
  }
  return pixels
}

function logSide(random: () => number): Pixels {
  const columns = Array.from({ length: SIZE }, () => pick(BARK, random))
  return Array.from({ length: SIZE }, () =>
    columns.map((color) => (random() < 0.12 ? pick(BARK, random) : color)),
  )
}

function logTop(random: () => number): Pixels {
  const center = (SIZE - 1) / 2
  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, (_, x) => {
      const ring = Math.floor(Math.max(Math.abs(x - center), Math.abs(y - center)))
      if (ring >= 7) return pick(BARK, random)
      return RINGS[ring % RINGS.length] ?? RINGS[0] ?? '#c19c63'
    }),
  )
}

const builders: Record<BlockType, { side: (random: () => number) => Pixels; top: (random: () => number) => Pixels }> = {
  gold: { side: gold, top: gold },
  grass: { side: grassSide, top: (random) => fill(GRASS, random) },
  log: { side: logSide, top: logTop },
  ore: { side: ore, top: ore },
  stone: { side: stone, top: stone },
}

export function createBlockTexture(type: BlockType, seed: number): BlockTexture {
  const { side, top } = builders[type]
  return {
    side: toDataUri(side(createRandom(seed))),
    top: toDataUri(top(createRandom(seed + 1))),
  }
}
