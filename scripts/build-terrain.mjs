import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { contours } from 'd3-contour'
import sharp from 'sharp'

const ZOOM = 12
const TILE_SIZE = 256
const TILE_X_RANGE = [1165, 1169]
const TILE_Y_RANGE = [2032, 2036]
const OUTPUT_SIZE = 256
const CONTOUR_GRID_SIZE = 180
const CONTOUR_INTERVAL_METERS = 200
const SMOOTHING_PASSES = 3
const CACHE_DIR = '.terrain-cache'
const OUTPUT_DIR = 'src/assets/terrain'
const SOURCE_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium'

const tileCount = TILE_X_RANGE[1] - TILE_X_RANGE[0] + 1

async function loadTile(x, y) {
  const cachePath = join(CACHE_DIR, `${ZOOM}_${x}_${y}.png`)
  if (!existsSync(cachePath)) {
    const response = await fetch(`${SOURCE_URL}/${ZOOM}/${x}/${y}.png`)
    if (!response.ok) throw new Error(`Tile ${x}/${y} failed: ${response.status}`)
    await writeFile(cachePath, Buffer.from(await response.arrayBuffer()))
  }
  return sharp(await readFile(cachePath)).removeAlpha().raw().toBuffer()
}

function decodeElevation(red, green, blue) {
  return red * 256 + green + blue / 256 - 32768
}

async function loadElevations() {
  const size = tileCount * TILE_SIZE
  const elevations = new Float32Array(size * size)
  for (let tileY = 0; tileY < tileCount; tileY += 1) {
    for (let tileX = 0; tileX < tileCount; tileX += 1) {
      const pixels = await loadTile(TILE_X_RANGE[0] + tileX, TILE_Y_RANGE[0] + tileY)
      for (let y = 0; y < TILE_SIZE; y += 1) {
        for (let x = 0; x < TILE_SIZE; x += 1) {
          const offset = (y * TILE_SIZE + x) * 3
          const target = (tileY * TILE_SIZE + y) * size + tileX * TILE_SIZE + x
          elevations[target] = decodeElevation(
            pixels[offset],
            pixels[offset + 1],
            pixels[offset + 2],
          )
        }
      }
    }
  }
  return { elevations, size }
}

function resample(elevations, sourceSize, targetSize) {
  const result = new Float32Array(targetSize * targetSize)
  const ratio = sourceSize / targetSize
  for (let y = 0; y < targetSize; y += 1) {
    for (let x = 0; x < targetSize; x += 1) {
      let total = 0
      let samples = 0
      const endY = Math.floor((y + 1) * ratio)
      const endX = Math.floor((x + 1) * ratio)
      for (let sourceY = Math.floor(y * ratio); sourceY < endY; sourceY += 1) {
        for (let sourceX = Math.floor(x * ratio); sourceX < endX; sourceX += 1) {
          total += elevations[sourceY * sourceSize + sourceX]
          samples += 1
        }
      }
      result[y * targetSize + x] = total / samples
    }
  }
  return result
}

function smooth(elevations, size) {
  const result = new Float32Array(elevations)
  for (let y = 1; y < size - 1; y += 1) {
    for (let x = 1; x < size - 1; x += 1) {
      let total = 0
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          total += elevations[(y + offsetY) * size + x + offsetX]
        }
      }
      result[y * size + x] = total / 9
    }
  }
  return result
}

function findPeak(elevations, size) {
  let index = 0
  for (let i = 1; i < elevations.length; i += 1) {
    if (elevations[i] > elevations[index]) index = i
  }
  return { x: (index % size) / size, y: Math.floor(index / size) / size }
}

function toSvgPath(geometry) {
  return geometry.coordinates
    .flatMap((polygon) => polygon)
    .map((ring) => `M${ring.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`)
    .join('')
}

async function writeHeightMap(elevations, min, max) {
  const pixels = Buffer.alloc(OUTPUT_SIZE * OUTPUT_SIZE)
  elevations.forEach((value, index) => {
    pixels[index] = Math.round(((value - min) / (max - min)) * 255)
  })
  await sharp(pixels, { raw: { width: OUTPUT_SIZE, height: OUTPUT_SIZE, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(join(OUTPUT_DIR, 'galeras-height.png'))
}

async function writeContours(elevations, size, min, max) {
  const first = Math.ceil(min / CONTOUR_INTERVAL_METERS) * CONTOUR_INTERVAL_METERS
  const thresholds = []
  for (let level = first; level <= max; level += CONTOUR_INTERVAL_METERS) thresholds.push(level)
  const lines = contours().size([size, size]).smooth(true).thresholds(thresholds)(
    Array.from(elevations),
  )
  const paths = lines.map((line) => ({ level: line.value, d: toSvgPath(line) }))
  await writeFile(
    join(OUTPUT_DIR, 'galeras-contours.json'),
    JSON.stringify({ size, interval: CONTOUR_INTERVAL_METERS, paths }),
  )
}

await mkdir(CACHE_DIR, { recursive: true })
await mkdir(OUTPUT_DIR, { recursive: true })

const { elevations, size } = await loadElevations()
const heightGrid = resample(elevations, size, OUTPUT_SIZE)
let contourGrid = resample(elevations, size, CONTOUR_GRID_SIZE)
for (let pass = 0; pass < SMOOTHING_PASSES; pass += 1) {
  contourGrid = smooth(contourGrid, CONTOUR_GRID_SIZE)
}
const min = heightGrid.reduce((lowest, value) => Math.min(lowest, value), Infinity)
const max = heightGrid.reduce((highest, value) => Math.max(highest, value), -Infinity)

await writeHeightMap(heightGrid, min, max)
await writeContours(contourGrid, CONTOUR_GRID_SIZE, min, max)
await writeFile(
  join(OUTPUT_DIR, 'galeras-meta.json'),
  JSON.stringify({
    minElevation: Math.round(min),
    maxElevation: Math.round(max),
    peak: findPeak(heightGrid, OUTPUT_SIZE),
    source: 'Mapzen Terrain Tiles (AWS Open Data)',
  }),
)

console.log(`Elevation ${Math.round(min)}m to ${Math.round(max)}m`)
