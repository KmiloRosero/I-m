import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { KEYBOARD_ROWS, ROW_UNITS, type KeySpec } from '@/utils/laptopKeyboard'

/**
 * A procedural MSI Cyborg 15, in centimetres (359.36 × 249.9 × 21.95 mm).
 * Origin: centre of the base's footprint, on its underside; +z is the front.
 */

export const BASE = { width: 35.9, depth: 25, height: 2.0 }
export const LID = { height: 24.3, thickness: 0.62 }
/** The hinge axis runs along x, at the back of the deck. */
export const HINGE = { y: BASE.height + 0.32, z: -BASE.depth / 2 + 0.75 }
export const OPEN_ANGLE = THREE.MathUtils.degToRad(112)
export const SCREEN = { width: 34.4, height: 19.35, bottom: 3.05 }

const KEY_PITCH = 1.9
const KEY_GAP = 0.34
const KEY_HEIGHT = 0.22
export const KEY_TRAVEL = 0.13
const KEYBOARD_BACK = -BASE.depth / 2 + 3.05
const ATLAS_UNIT = 112

export interface LaptopKey {
  code: string
  mesh: THREE.Object3D
  restY: number
  /** Press depth spring, in cm. */
  offset: number
  velocity: number
  target: number
}

export interface LaptopModel {
  root: THREE.Group
  lid: THREE.Group
  screen: THREE.Mesh
  screenTexture: THREE.CanvasTexture
  keys: Map<string, LaptopKey>
  /** Meshes that belong to the lid, for grabbing it. */
  lidParts: THREE.Object3D[]
  /** Everything the pointer can act on. */
  pickables: THREE.Object3D[]
  shadow: THREE.Mesh
  screenLight: THREE.PointLight
  dispose: () => void
}

export function buildLaptop(screenCanvas: HTMLCanvasElement, fonts: { display: string }): LaptopModel {
  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item)
    return item
  }

  const root = new THREE.Group()
  root.name = 'cyborg-15'

  // Materials: dark gunmetal shell, glossy black bezel, rubber, port shadows.
  const shell = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x1a1c22,
      metalness: 0.35,
      roughness: 0.48,
      clearcoat: 0.25,
      clearcoatRoughness: 0.5,
    }),
  )
  const deckMaterial = track(new THREE.MeshStandardMaterial({ color: 0x17191e, metalness: 0.08, roughness: 0.72 }))
  const well = track(new THREE.MeshStandardMaterial({ color: 0x08090c, roughness: 0.85 }))
  const bezelMaterial = track(
    new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.62, metalness: 0, envMapIntensity: 0.25 }),
  )
  const rubber = track(new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.95 }))
  const portMaterial = track(new THREE.MeshStandardMaterial({ color: 0x020203, roughness: 1 }))
  const portInner = track(new THREE.MeshStandardMaterial({ color: 0x26292f, roughness: 0.7, metalness: 0.4 }))
  const smoke = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x2a2e36,
      metalness: 0.1,
      roughness: 0.15,
      transparent: true,
      opacity: 0.55,
      clearcoat: 1,
    }),
  )

  // ── Base ──────────────────────────────────────────────────────────────
  const base = new THREE.Mesh(track(new RoundedBoxGeometry(BASE.width, BASE.height, BASE.depth, 4, 0.55)), shell)
  base.position.y = BASE.height / 2
  root.add(base)

  // Deck top plate, slightly inset so the shell's rounded edge frames it.
  const deck = new THREE.Mesh(
    track(new RoundedBoxGeometry(BASE.width - 0.5, 0.04, BASE.depth - 0.5, 2, 0.02)),
    deckMaterial,
  )
  deck.position.y = BASE.height + 0.005
  root.add(deck)

  // Smoked translucent strip behind the keyboard, as on the Cyborg's chassis.
  const strip = new THREE.Mesh(track(new THREE.BoxGeometry(BASE.width - 3, 0.05, 1.5)), smoke)
  strip.position.set(0, BASE.height + 0.03, -BASE.depth / 2 + 1.75)
  root.add(strip)
  const stripLines = new THREE.Mesh(
    track(new THREE.PlaneGeometry(BASE.width - 3.2, 1.3)),
    track(new THREE.MeshBasicMaterial({ map: track(circuitTexture()), transparent: true, depthWrite: false })),
  )
  stripLines.rotation.x = -Math.PI / 2
  stripLines.position.set(0, BASE.height + 0.058, -BASE.depth / 2 + 1.75)
  root.add(stripLines)

  // ── Keyboard ──────────────────────────────────────────────────────────
  const keyboardWidth = ROW_UNITS * KEY_PITCH
  const keyboardDepth = KEYBOARD_ROWS.reduce((sum, row) => sum + row.height * KEY_PITCH, 0)

  const keyWell = new THREE.Mesh(
    track(new RoundedBoxGeometry(keyboardWidth + 0.6, 0.03, keyboardDepth + 0.6, 2, 0.015)),
    well,
  )
  keyWell.position.set(0, BASE.height + 0.03, KEYBOARD_BACK + keyboardDepth / 2)
  root.add(keyWell)

  // Backlight: a cyan plane under the keys that shows through the gaps.
  const backlight = new THREE.Mesh(
    track(new THREE.PlaneGeometry(keyboardWidth, keyboardDepth)),
    track(new THREE.MeshBasicMaterial({ color: 0x0b6c7a, transparent: true, opacity: 0.85, toneMapped: false })),
  )
  backlight.rotation.x = -Math.PI / 2
  backlight.position.set(0, BASE.height + 0.05, KEYBOARD_BACK + keyboardDepth / 2)
  root.add(backlight)

  const atlas = legendAtlas(fonts.display)
  const atlasTexture = track(new THREE.CanvasTexture(atlas.canvas))
  atlasTexture.colorSpace = THREE.SRGBColorSpace
  atlasTexture.anisotropy = 4
  const legendMaterial = track(
    new THREE.MeshBasicMaterial({ map: atlasTexture, transparent: true, depthWrite: false, toneMapped: false }),
  )
  const keycap = track(
    new THREE.MeshStandardMaterial({
      color: 0x111318,
      metalness: 0.15,
      roughness: 0.55,
      emissive: 0x00e5ff,
      emissiveIntensity: 0,
    }),
  )
  const accentKeycap = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x0f3a42,
      emissive: 0x00c8e0,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92,
    }),
  )

  const keyGeometries = new Map<string, THREE.BufferGeometry>()
  const keyGeometry = (width: number, depth: number) => {
    const id = `${width.toFixed(3)}x${depth.toFixed(3)}`
    let geometry = keyGeometries.get(id)
    if (!geometry) {
      geometry = track(new RoundedBoxGeometry(width, KEY_HEIGHT, depth, 2, 0.08))
      keyGeometries.set(id, geometry)
    }
    return geometry
  }

  const keys = new Map<string, LaptopKey>()
  const pickables: THREE.Object3D[] = []
  const restY = BASE.height + 0.05 + KEY_HEIGHT / 2

  let rowZ = KEYBOARD_BACK
  for (const row of KEYBOARD_ROWS) {
    const rowDepth = row.height * KEY_PITCH
    let x = -keyboardWidth / 2
    for (const spec of row.keys) {
      const width = spec.width * KEY_PITCH
      const capWidth = width - KEY_GAP
      const capDepth = rowDepth - KEY_GAP
      // Each key gets its own material, so it can flash when pressed.
      const material = track((spec.accent ? accentKeycap : keycap).clone())
      material.userData.restGlow = material.emissiveIntensity
      const mesh = new THREE.Mesh(keyGeometry(capWidth, capDepth), material)
      mesh.position.set(x + width / 2, restY, rowZ + rowDepth / 2)
      mesh.userData.code = spec.code

      const legend = new THREE.Mesh(
        track(legendGeometry(capWidth, capDepth, atlas.rects.get(spec.code))),
        legendMaterial,
      )
      legend.rotation.x = -Math.PI / 2
      legend.position.y = KEY_HEIGHT / 2 + 0.003
      legend.userData.code = spec.code
      mesh.add(legend)

      root.add(mesh)
      pickables.push(mesh)
      keys.set(spec.code, { code: spec.code, mesh, restY, offset: 0, velocity: 0, target: 0 })
      x += width
    }
    rowZ += rowDepth
  }

  // Power button, right of the function row.
  const power = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.42, 0.42, KEY_HEIGHT, 32)),
    track(
      new THREE.MeshPhysicalMaterial({ color: 0x0c2f36, emissive: 0x00e5ff, emissiveIntensity: 0.6, roughness: 0.25 }),
    ),
  )
  power.position.set(keyboardWidth / 2 + 1.55, restY, KEYBOARD_BACK + KEYBOARD_ROWS[0]!.height * KEY_PITCH * 0.5)
  power.userData.code = 'Power'
  root.add(power)
  pickables.push(power)
  keys.set('Power', { code: 'Power', mesh: power, restY, offset: 0, velocity: 0, target: 0 })
  const powerIcon = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.62, 0.62)),
    track(new THREE.MeshBasicMaterial({ map: track(powerIconTexture()), transparent: true, toneMapped: false })),
  )
  powerIcon.rotation.x = -Math.PI / 2
  powerIcon.position.y = KEY_HEIGHT / 2 + 0.003
  power.add(powerIcon)

  // Touchpad, centred under the space bar.
  const keyboardFront = KEYBOARD_BACK + keyboardDepth
  const padDepth = 7.3
  const touchpad = new THREE.Mesh(
    track(new RoundedBoxGeometry(12.2, 0.06, padDepth, 3, 0.03)),
    track(new THREE.MeshPhysicalMaterial({ color: 0x1d2027, roughness: 0.32, clearcoat: 0.6, metalness: 0.2 })),
  )
  const padRestY = BASE.height + 0.02
  touchpad.position.set(-1.3, padRestY, keyboardFront + 1.15 + padDepth / 2)
  touchpad.userData.code = 'Touchpad'
  root.add(touchpad)
  pickables.push(touchpad)
  keys.set('Touchpad', { code: 'Touchpad', mesh: touchpad, restY: padRestY, offset: 0, velocity: 0, target: 0 })

  // Front lip notch for opening the lid, and a status LED.
  const notch = new THREE.Mesh(track(new THREE.BoxGeometry(6, 0.18, 0.4)), well)
  notch.position.set(0, BASE.height - 0.05, BASE.depth / 2 - 0.12)
  root.add(notch)
  const led = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.35, 0.08, 0.05)),
    track(new THREE.MeshBasicMaterial({ color: 0x5ff3ff, toneMapped: false })),
  )
  led.position.set(-BASE.width / 2 + 3, BASE.height * 0.55, BASE.depth / 2 + 0.005)
  root.add(led)

  // ── Ports and vents ───────────────────────────────────────────────────
  const side = BASE.width / 2 + 0.01
  const port = (x: number, z: number, height: number, length: number, inner = true) => {
    const opening = new THREE.Mesh(track(new THREE.BoxGeometry(0.06, height, length)), portMaterial)
    opening.position.set(x, BASE.height * 0.5, z)
    root.add(opening)
    if (inner) {
      const tongue = new THREE.Mesh(track(new THREE.BoxGeometry(0.065, height * 0.32, length * 0.8)), portInner)
      tongue.position.set(x, BASE.height * 0.5 + height * 0.12, z)
      root.add(tongue)
    }
  }
  const roundPort = (x: number, z: number, radius: number) => {
    const hole = new THREE.Mesh(track(new THREE.CylinderGeometry(radius, radius, 0.06, 24)), portMaterial)
    hole.rotation.z = Math.PI / 2
    hole.position.set(x, BASE.height * 0.5, z)
    root.add(hole)
  }
  // Right: RJ45, HDMI, USB-C, USB-A (back to front).
  port(side, -8.4, 1.0, 1.35)
  port(side, -5.9, 0.5, 1.5)
  port(side, -4.1, 0.3, 0.9, false)
  port(side, -2.3, 0.55, 1.3)
  // Left: DC-in, USB-A, USB-A, audio.
  roundPort(-side, -9.2, 0.32)
  port(-side, -6.6, 0.55, 1.3)
  port(-side, -4.6, 0.55, 1.3)
  roundPort(-side, -2.6, 0.2)

  // Rear exhaust slats.
  const slat = track(new THREE.BoxGeometry(0.22, 0.9, 0.06))
  for (let index = 0; index < 40; index += 1) {
    for (const offset of [-1, 1]) {
      const vent = new THREE.Mesh(slat, portMaterial)
      vent.position.set(offset * (4.2 + index * 0.27), BASE.height * 0.48, -BASE.depth / 2 - 0.005)
      root.add(vent)
    }
  }

  // Underside: intake grille, rubber feet and a label.
  const bottom = new THREE.Mesh(
    track(new THREE.PlaneGeometry(BASE.width - 1.2, BASE.depth - 1.2)),
    track(new THREE.MeshStandardMaterial({ map: track(bottomTexture(fonts.display)), roughness: 0.8 })),
  )
  bottom.rotation.x = Math.PI / 2
  bottom.position.y = -0.005
  root.add(bottom)
  const foot = track(new RoundedBoxGeometry(BASE.width - 7, 0.3, 0.9, 2, 0.12))
  for (const z of [-BASE.depth / 2 + 1.6, BASE.depth / 2 - 1.6]) {
    const strip = new THREE.Mesh(foot, rubber)
    strip.position.set(0, -0.1, z)
    root.add(strip)
  }

  // ── Hinge ─────────────────────────────────────────────────────────────
  const barrel = new THREE.Mesh(track(new THREE.CylinderGeometry(0.42, 0.42, BASE.width - 7, 24)), shell)
  barrel.rotation.z = Math.PI / 2
  barrel.position.set(0, HINGE.y - 0.12, HINGE.z - 0.28)
  root.add(barrel)

  // ── Lid ───────────────────────────────────────────────────────────────
  // Built upright (screen toward +z) around the hinge; rotation.x opens it.
  const lid = new THREE.Group()
  lid.position.set(0, HINGE.y, HINGE.z)
  root.add(lid)
  const lidParts: THREE.Object3D[] = []
  const lidMesh = (mesh: THREE.Mesh) => {
    lid.add(mesh)
    lidParts.push(mesh)
    pickables.push(mesh)
    return mesh
  }

  const lidBottom = -0.25
  const lidShell = lidMesh(
    new THREE.Mesh(track(new RoundedBoxGeometry(BASE.width, LID.height, LID.thickness, 4, 0.28)), shell),
  )
  lidShell.position.set(0, lidBottom + LID.height / 2, -LID.thickness / 2)

  const bezel = lidMesh(
    new THREE.Mesh(track(new RoundedBoxGeometry(BASE.width - 0.3, LID.height - 0.3, 0.03, 2, 0.012)), bezelMaterial),
  )
  bezel.position.set(0, lidBottom + LID.height / 2, 0.003)

  const screenTexture = track(new THREE.CanvasTexture(screenCanvas))
  screenTexture.colorSpace = THREE.SRGBColorSpace
  screenTexture.anisotropy = 8
  const screen = lidMesh(
    new THREE.Mesh(
      track(new THREE.PlaneGeometry(SCREEN.width, SCREEN.height)),
      track(new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false })),
    ),
  )
  screen.position.set(0, SCREEN.bottom + SCREEN.height / 2, 0.022)
  screen.userData.part = 'screen'

  const chinLogo = new THREE.Mesh(
    track(new THREE.PlaneGeometry(2.6, 0.75)),
    track(new THREE.MeshBasicMaterial({ map: track(logoTexture(fonts.display, '#c9ccd3')), transparent: true })),
  )
  chinLogo.position.set(0, 1.45, 0.025)
  chinLogo.raycast = () => {}
  lid.add(chinLogo)

  const webcamY = SCREEN.bottom + SCREEN.height + (LID.height + lidBottom - SCREEN.bottom - SCREEN.height) / 2
  const webcam = new THREE.Mesh(
    track(new THREE.CircleGeometry(0.2, 24)),
    track(new THREE.MeshPhysicalMaterial({ color: 0x0a0d18, roughness: 0.05, clearcoat: 1 })),
  )
  webcam.position.set(0, webcamY, 0.025)
  lid.add(webcam)
  const lens = new THREE.Mesh(
    track(new THREE.CircleGeometry(0.07, 16)),
    track(new THREE.MeshBasicMaterial({ color: 0x23306b })),
  )
  lens.position.set(0.03, webcamY + 0.03, 0.027)
  lid.add(lens)

  // Back of the lid: the logo and two smoked accent lines.
  const backLogo = new THREE.Mesh(
    track(new THREE.PlaneGeometry(6.4, 1.85)),
    track(new THREE.MeshBasicMaterial({ map: track(logoTexture(fonts.display, '#d7dae0')), transparent: true })),
  )
  backLogo.rotation.y = Math.PI
  backLogo.position.set(0, lidBottom + LID.height * 0.55, -LID.thickness - 0.004)
  backLogo.raycast = () => {}
  lid.add(backLogo)
  for (const offset of [-1, 1]) {
    const accent = new THREE.Mesh(track(new THREE.BoxGeometry(0.5, LID.height * 0.62, 0.02)), smoke)
    accent.position.set(offset * (BASE.width / 2 - 4.2), lidBottom + LID.height * 0.5, -LID.thickness - 0.012)
    lid.add(accent)
  }

  // Light from the display, so the keyboard picks up its glow.
  const screenLight = new THREE.PointLight(0x7fa8ff, 0, 30, 1.6)
  screenLight.position.set(0, SCREEN.bottom + SCREEN.height * 0.4, 3)
  lid.add(screenLight)

  // ── Floor shadow ──────────────────────────────────────────────────────
  const shadow = new THREE.Mesh(
    track(new THREE.PlaneGeometry(BASE.width * 1.7, BASE.depth * 1.9)),
    track(
      new THREE.MeshBasicMaterial({
        map: track(shadowTexture()),
        transparent: true,
        depthWrite: false,
        color: 0x000000,
        opacity: 0.75,
      }),
    ),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.27
  shadow.raycast = () => {}
  root.add(shadow)

  return {
    root,
    lid,
    screen,
    screenTexture,
    keys,
    lidParts,
    pickables,
    shadow,
    screenLight,
    dispose: () => disposables.forEach((item) => item.dispose()),
  }
}

/** A plane whose UVs show this key's cell of the legend atlas. */
function legendGeometry(width: number, depth: number, rect: AtlasRect | undefined) {
  const geometry = new THREE.PlaneGeometry(width * 0.92, depth * 0.9)
  if (!rect) return geometry
  const uv = geometry.attributes.uv as THREE.BufferAttribute
  for (let index = 0; index < uv.count; index += 1) {
    uv.setXY(index, rect.u0 + uv.getX(index) * (rect.u1 - rect.u0), rect.v0 + uv.getY(index) * (rect.v1 - rect.v0))
  }
  return geometry
}

interface AtlasRect {
  u0: number
  v0: number
  u1: number
  v1: number
}

/** All key legends drawn as the keyboard itself, so each key maps to its own cell. */
function legendAtlas(font: string) {
  const rowsHeight = KEYBOARD_ROWS.reduce((sum, row) => sum + row.height, 0)
  const canvas = document.createElement('canvas')
  canvas.width = ROW_UNITS * ATLAS_UNIT
  canvas.height = Math.ceil(rowsHeight * ATLAS_UNIT)
  const ctx = canvas.getContext('2d')!
  const rects = new Map<string, AtlasRect>()

  let top = 0
  for (const row of KEYBOARD_ROWS) {
    const height = row.height * ATLAS_UNIT
    let left = 0
    for (const spec of row.keys) {
      const width = spec.width * ATLAS_UNIT
      drawLegend(ctx, spec, left, top, width, height, font)
      rects.set(spec.code, {
        u0: left / canvas.width,
        u1: (left + width) / canvas.width,
        v0: 1 - (top + height) / canvas.height,
        v1: 1 - top / canvas.height,
      })
      left += width
    }
    top += height
  }
  return { canvas, rects }
}

function drawLegend(
  ctx: CanvasRenderingContext2D,
  spec: KeySpec,
  left: number,
  top: number,
  width: number,
  height: number,
  font: string,
) {
  ctx.save()
  ctx.fillStyle = '#7ff6ff'
  ctx.shadowColor = '#00e5ff'
  ctx.shadowBlur = 10
  ctx.textBaseline = 'middle'
  const isWord = spec.label.length > 1
  const pad = width * 0.14
  if (spec.code === 'Space') {
    ctx.fillRect(left + width * 0.3, top + height * 0.72, width * 0.4, 3)
  } else if (spec.shift) {
    ctx.textAlign = 'left'
    ctx.font = `700 ${height * 0.26}px ${font}`
    ctx.fillText(spec.shift, left + pad, top + height * 0.3)
    ctx.font = `800 ${height * 0.3}px ${font}`
    ctx.fillText(spec.label, left + pad, top + height * 0.66)
  } else if (isWord && !/^F\d+$|^(Esc|Ins|Del|Fn)$/.test(spec.label)) {
    ctx.textAlign = 'left'
    ctx.font = `700 ${height * 0.22}px ${font}`
    ctx.fillText(spec.label.toUpperCase(), left + pad * 0.7, top + height * 0.68)
  } else {
    ctx.textAlign = 'center'
    const size = isCharacterKey(spec) ? height * 0.42 : height * 0.36
    ctx.font = `800 ${size}px ${font}`
    ctx.fillText(spec.label, left + width / 2, top + height * 0.52)
  }
  ctx.restore()
}

function isCharacterKey(spec: KeySpec) {
  return /^Key[A-Z]$|^Digit\d$/.test(spec.code)
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d')!)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function logoTexture(font: string, color: string) {
  return canvasTexture(512, 148, (ctx) => {
    ctx.fillStyle = color
    ctx.font = `italic 900 118px ${font}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = '6px'
    ctx.fillText('MSI', 256, 78)
  })
}

function powerIconTexture() {
  return canvasTexture(128, 128, (ctx) => {
    ctx.strokeStyle = '#d9fbff'
    ctx.shadowColor = '#00e5ff'
    ctx.shadowBlur = 8
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(64, 68, 34, -Math.PI * 0.32, Math.PI * 1.32)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(64, 22)
    ctx.lineTo(64, 64)
    ctx.stroke()
  })
}

function circuitTexture() {
  return canvasTexture(1024, 48, (ctx) => {
    ctx.strokeStyle = 'rgba(160, 175, 200, 0.35)'
    ctx.lineWidth = 2
    for (let x = 20; x < 1024; x += 64) {
      ctx.beginPath()
      ctx.moveTo(x, 8)
      ctx.lineTo(x + 18, 8)
      ctx.lineTo(x + 30, 24)
      ctx.lineTo(x + 52, 24)
      ctx.stroke()
      ctx.strokeRect(x + 52, 20, 6, 8)
    }
  })
}

function bottomTexture(font: string) {
  return canvasTexture(1024, 720, (ctx) => {
    ctx.fillStyle = '#121418'
    ctx.fillRect(0, 0, 1024, 720)
    // Intake grille: rows of rounded slots over the fans.
    ctx.fillStyle = '#040405'
    for (let y = 70; y < 330; y += 22) {
      for (let x = 140; x < 884; x += 40) {
        ctx.beginPath()
        ctx.roundRect(x + ((y / 22) % 2) * 20, y, 30, 10, 5)
        ctx.fill()
      }
    }
    // Screws.
    ctx.fillStyle = '#2b2e35'
    for (const [x, y] of [
      [40, 40],
      [984, 40],
      [40, 680],
      [984, 680],
      [512, 680],
      [300, 400],
      [724, 400],
    ] as const) {
      ctx.beginPath()
      ctx.arc(x, y, 9, 0, Math.PI * 2)
      ctx.fill()
    }
    // Label.
    ctx.fillStyle = '#c8cbd1'
    ctx.beginPath()
    ctx.roundRect(392, 470, 240, 120, 8)
    ctx.fill()
    ctx.fillStyle = '#111'
    ctx.font = `italic 900 40px ${font}`
    ctx.textAlign = 'center'
    ctx.fillText('MSI', 512, 518)
    ctx.font = `700 22px ${font}`
    ctx.fillText('Cyborg 15', 512, 556)
  })
}

function shadowTexture() {
  return canvasTexture(256, 256, (ctx) => {
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.55)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
  })
}
