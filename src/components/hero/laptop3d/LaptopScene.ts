import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { KEYBOARD_ROWS } from '@/utils/laptopKeyboard'
import { createSpring, isSpringSettled, settleSpring, stepSpring, type Spring } from '@/utils/spring'
import { buildLaptop, HINGE, KEY_TRAVEL, OPEN_ANGLE, type LaptopKey, type LaptopModel } from './buildLaptop'
import { ScreenPainter, type ScreenContent } from './ScreenPainter'

export interface LaptopSceneOptions {
  container: HTMLElement
  content: ScreenContent
  reducedMotion: boolean
  onFirstInteraction: () => void
}

const deg = THREE.MathUtils.degToRad
/** The resting view: three-quarters from the front right. */
const HOME = { azimuth: deg(34), polar: deg(63) }
const POLAR_MIN = deg(5)
const POLAR_MAX = deg(165)
const LID_MAX = deg(128)
/** Below this the lid's magnets pull it shut. */
const LID_LATCH = deg(16)
/** The display turns off below this lid angle. */
const SCREEN_ON_ANGLE = deg(38)
const FOV = 30
/** Share of the view (in NDC) the laptop's outline may fill. */
const FRAME_FILL = 0.97
const STEP = 1 / 120
const DRAG_THRESHOLD = 6
const ORBIT_SPEED = 0.0085
const CARET_INTERVAL = 530

const SPRINGS = {
  view: { stiffness: 38, damping: 12 },
  framing: { stiffness: 30, damping: 11 },
  lid: { stiffness: 55, damping: 10 },
  lidDrag: { stiffness: 420, damping: 42 },
  key: { stiffness: 1500, damping: 48 },
}

type Mode =
  | { kind: 'idle' }
  | { kind: 'orbit'; lastX: number; lastY: number; lastTime: number; vAzimuth: number; vPolar: number }
  | { kind: 'key'; code: string }
  | { kind: 'lid'; dragging: boolean; radius: number; link: string | null }

const characters = new Map(
  KEYBOARD_ROWS.flatMap((row) =>
    row.keys.map((spec) => {
      if (spec.code === 'Space') return [spec.code, ' '] as const
      if (/^Key[A-Z]$/.test(spec.code)) return [spec.code, spec.label.toLowerCase()] as const
      return [spec.code, spec.label.length === 1 && !/[▲▼◀▶⟵⊞]/.test(spec.label) ? spec.label : null] as const
    }),
  ),
)

export class LaptopScene {
  private readonly container: HTMLElement
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 1, 1000)
  private readonly model: LaptopModel
  private readonly painter: ScreenPainter
  private readonly environment: THREE.Texture
  private readonly raycaster = new THREE.Raycaster()
  private readonly pointer = new THREE.Vector2()
  private readonly options: LaptopSceneOptions
  private readonly reducedMotion: boolean

  private readonly azimuth: Spring
  private readonly polar: Spring
  private readonly lid: Spring
  private lidDragging = false
  private screenOn = true
  /** Camera distance, eased toward whatever fits the laptop's current outline. */
  private readonly distance = createSpring(70)
  private framed = false
  private readonly bounds = new THREE.Box3()
  private readonly corner = new THREE.Vector3()
  private readonly center = new THREE.Vector3()
  private readonly cameraRight = new THREE.Vector3()
  private readonly cameraUp = new THREE.Vector3()
  /** Sideways and vertical shift of the aim point that centres the silhouette (cm, camera plane). */
  private aimX = 0
  private aimY = 0
  private aimMoving = false
  private readonly target = new THREE.Vector3()

  private mode: Mode = { kind: 'idle' }
  private pointerId: number | null = null
  private downX = 0
  private downY = 0
  private interacted = false
  private frame = 0
  private lastTime = 0
  private accumulator = 0
  private visible = true
  private screenDirty = true
  private caretTimer = 0
  private entranceTimer = 0
  private readonly heldKeys = new Set<string>()
  private readonly cleanups: (() => void)[] = []

  constructor(options: LaptopSceneOptions) {
    this.options = options
    this.container = options.container
    this.reducedMotion = options.reducedMotion

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.setClearColor(0x000000, 0)
    const canvas = this.renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    canvas.className = 'laptop3d-gl'
    this.container.appendChild(canvas)

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const room = new RoomEnvironment()
    this.environment = pmrem.fromScene(room, 0.04).texture
    room.dispose()
    pmrem.dispose()
    this.scene.environment = this.environment
    this.scene.environmentIntensity = 0.6

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(18, 32, 22)
    const rim = new THREE.DirectionalLight(0x00e5ff, 0.55)
    rim.position.set(-26, 12, -22)
    const fill = new THREE.DirectionalLight(0x1f51ff, 0.45)
    fill.position.set(24, -6, -16)
    this.scene.add(key, rim, fill)

    this.painter = new ScreenPainter(options.content, () => this.markScreenDirty())
    this.model = buildLaptop(this.painter.canvas, options.content.fonts)
    this.scene.add(this.model.root)

    const home = HOME
    const animateIn = !this.reducedMotion
    this.azimuth = createSpring(animateIn ? home.azimuth - 1.25 : home.azimuth, home.azimuth)
    this.polar = createSpring(animateIn ? deg(48) : home.polar, home.polar)
    this.lid = createSpring(animateIn ? 0 : OPEN_ANGLE, animateIn ? 0 : OPEN_ANGLE)
    this.painter.power = animateIn ? 0 : 1
    if (animateIn) this.entranceTimer = window.setTimeout(() => this.setLidTarget(OPEN_ANGLE), 420)

    this.applyLid()
    this.resize()
    this.listen()
    this.requestRender()
  }

  // ── Public ──────────────────────────────────────────────────────────────

  dispose() {
    cancelAnimationFrame(this.frame)
    window.clearInterval(this.caretTimer)
    window.clearTimeout(this.entranceTimer)
    this.cleanups.forEach((cleanup) => cleanup())
    this.model.dispose()
    this.environment.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }

  // ── State ───────────────────────────────────────────────────────────────

  private setLidTarget(angle: number) {
    this.lid.target = THREE.MathUtils.clamp(angle, 0, LID_MAX)
    if (this.reducedMotion) settleSpring(this.lid)
    this.requestRender()
  }

  private toggleScreen() {
    this.screenOn = !this.screenOn
    this.requestRender()
  }

  private markInteracted() {
    if (this.interacted) return
    this.interacted = true
    this.options.onFirstInteraction()
  }

  private markScreenDirty() {
    this.screenDirty = true
    this.requestRender()
  }

  // ── Loop ────────────────────────────────────────────────────────────────

  private requestRender = () => {
    if (this.frame || !this.visible) return
    this.lastTime = 0
    this.frame = requestAnimationFrame(this.tick)
  }

  private tick = (time: number) => {
    this.frame = 0
    const seconds = this.lastTime ? Math.min((time - this.lastTime) / 1000, 1 / 10) : 1 / 60
    this.lastTime = time
    this.accumulator = Math.min(this.accumulator + seconds, STEP * 14)
    while (this.accumulator >= STEP) {
      this.step(STEP)
      this.accumulator -= STEP
    }
    this.render()
    if (this.isAnimating() && this.visible) this.frame = requestAnimationFrame(this.tick)
  }

  private step(dt: number) {
    if (this.mode.kind !== 'orbit') {
      stepSpring(this.azimuth, SPRINGS.view.stiffness, SPRINGS.view.damping, dt)
      stepSpring(this.polar, SPRINGS.view.stiffness, SPRINGS.view.damping, dt)
    }

    const lidSpring = this.lidDragging ? SPRINGS.lidDrag : SPRINGS.lid
    stepSpring(this.lid, lidSpring.stiffness, lidSpring.damping, dt)
    // The lid stops on the deck and at the hinge's limit, with a small rebound.
    if (this.lid.value < 0) {
      this.lid.value = 0
      this.lid.velocity = Math.abs(this.lid.velocity) * 0.22
    } else if (this.lid.value > LID_MAX) {
      this.lid.value = LID_MAX
      this.lid.velocity = -Math.abs(this.lid.velocity) * 0.22
    }

    for (const key of this.model.keys.values()) {
      if (key.offset === key.target && key.velocity === 0) continue
      const spring = { value: key.offset, velocity: key.velocity, target: key.target }
      stepSpring(spring, SPRINGS.key.stiffness, SPRINGS.key.damping, dt)
      key.offset = spring.value
      key.velocity = spring.velocity
      if (isSpringSettled(spring, 1e-4)) {
        key.offset = key.target
        key.velocity = 0
      }
    }

    stepSpring(this.distance, SPRINGS.framing.stiffness, SPRINGS.framing.damping, dt)

    // Display power follows the switch and the lid angle.
    const powerTarget = this.screenOn && this.lid.value > SCREEN_ON_ANGLE ? 1 : 0
    if (this.painter.power !== powerTarget) {
      const rate = powerTarget > this.painter.power ? 1.15 : 3.2
      const delta = rate * dt * Math.sign(powerTarget - this.painter.power)
      this.painter.power =
        Math.abs(powerTarget - this.painter.power) <= Math.abs(delta) ? powerTarget : this.painter.power + delta
      this.screenDirty = true
    }
  }

  private isAnimating() {
    if (this.mode.kind === 'orbit' || this.lidDragging) return true
    if (!isSpringSettled(this.azimuth) || !isSpringSettled(this.polar) || !isSpringSettled(this.lid, 1e-4)) return true
    if (!isSpringSettled(this.distance, 0.02) || this.aimMoving) return true
    const powerTarget = this.screenOn && this.lid.value > SCREEN_ON_ANGLE ? 1 : 0
    if (this.painter.power !== powerTarget) return true
    for (const key of this.model.keys.values()) if (key.offset !== key.target || key.velocity !== 0) return true
    return false
  }

  private render() {
    this.applyLid()
    for (const key of this.model.keys.values()) {
      key.mesh.position.y = key.restY - key.offset
      // Pressed keys light up with the backlight colour.
      const material = (key.mesh as THREE.Mesh).material
      if (material instanceof THREE.MeshStandardMaterial && typeof material.userData.restGlow === 'number') {
        material.emissiveIntensity = material.userData.restGlow + (key.offset / KEY_TRAVEL) * 0.9
      }
    }

    this.frame3d()
    // The floor shadow only makes sense from above the floor.
    this.model.shadow.visible = this.camera.position.y > 0

    this.model.screenLight.intensity = this.painter.power * 60
    if (this.screenDirty) {
      this.painter.draw()
      this.model.screenTexture.needsUpdate = true
      this.screenDirty = false
    }
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Aims at the middle of the laptop in its current pose and eases the camera
   * distance so its outline fills the view without being cut off, whether
   * it is open, closed or seen from any side.
   */
  private frame3d() {
    this.model.root.updateMatrixWorld(true)
    this.bounds.makeEmpty()
    for (const part of this.model.frameParts) this.bounds.expandByObject(part)
    this.bounds.getCenter(this.center)

    this.polar.value = THREE.MathUtils.clamp(this.polar.value, POLAR_MIN, POLAR_MAX)
    // On the first frame (or without motion) iterate to the fit instead of easing.
    const settle = !this.framed || this.reducedMotion
    const passes = settle ? 8 : 1
    const gain = settle ? 1 : 0.35
    this.aimMoving = false
    for (let pass = 0; pass < passes; pass += 1) {
      this.placeCamera()
      const outline = this.silhouette()
      if (!outline) break
      // Re-centre the silhouette, then size it to fill the view.
      const halfHeight = this.distance.value * Math.tan(deg(FOV) / 2)
      const halfWidth = halfHeight * this.camera.aspect
      const shiftX = outline.centerX * halfWidth * gain
      const shiftY = outline.centerY * halfHeight * gain
      this.aimX += shiftX
      this.aimY += shiftY
      this.aimMoving = Math.abs(shiftX) + Math.abs(shiftY) > 0.005
      const fit = outline.extent / FRAME_FILL
      if (Number.isFinite(fit) && fit > 0) this.distance.target = this.distance.value * fit
      if (settle) settleSpring(this.distance)
    }
    this.framed = true
    this.placeCamera()
  }

  private placeCamera() {
    // Aim point: the laptop's centre, shifted in the camera plane to centre its outline.
    this.camera.matrixWorld.extractBasis(this.cameraRight, this.cameraUp, this.corner)
    this.target.copy(this.center).addScaledVector(this.cameraRight, this.aimX).addScaledVector(this.cameraUp, this.aimY)
    const distance = this.distance.value
    const sinPolar = Math.sin(this.polar.value)
    this.camera.position.set(
      this.target.x + distance * sinPolar * Math.sin(this.azimuth.value),
      this.target.y + distance * Math.cos(this.polar.value),
      this.target.z + distance * sinPolar * Math.cos(this.azimuth.value),
    )
    this.camera.lookAt(this.target)
    this.camera.updateMatrixWorld()
  }

  /**
   * The laptop's outline on screen, from the vertices of its outer shells:
   * the centre of its NDC bounds and its half-size on the tighter axis.
   */
  private silhouette() {
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const part of this.model.frameParts) {
      const positions = part.geometry.attributes.position as THREE.BufferAttribute
      for (let index = 0; index < positions.count; index += 2) {
        this.corner.fromBufferAttribute(positions, index).applyMatrix4(part.matrixWorld).project(this.camera)
        minX = Math.min(minX, this.corner.x)
        maxX = Math.max(maxX, this.corner.x)
        minY = Math.min(minY, this.corner.y)
        maxY = Math.max(maxY, this.corner.y)
      }
    }
    if (!Number.isFinite(minX)) return null
    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      extent: Math.max((maxX - minX) / 2, (maxY - minY) / 2),
    }
  }

  private applyLid() {
    this.model.lid.rotation.x = Math.PI / 2 - this.lid.value
  }

  private resize = () => {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    if (!width || !height) return
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.framed = false
    this.render()
  }

  // ── Input ───────────────────────────────────────────────────────────────

  private listen() {
    const canvas = this.renderer.domElement
    const on = <K extends keyof HTMLElementEventMap>(
      target: HTMLElement | Window,
      type: K,
      handler: (event: HTMLElementEventMap[K]) => void,
    ) => {
      target.addEventListener(type, handler as EventListener)
      this.cleanups.push(() => target.removeEventListener(type, handler as EventListener))
    }

    on(canvas, 'pointerdown', this.onPointerDown)
    on(canvas, 'pointermove', this.onHover)
    on(canvas, 'pointerleave', () => this.setHover(null, null))
    on(window, 'pointermove', this.onPointerMove)
    on(window, 'pointerup', this.onPointerUp)
    on(window, 'pointercancel', this.onPointerUp)
    on(window, 'keydown', this.onKeyDown)
    on(window, 'keyup', this.onKeyUp)
    on(window, 'blur', this.releaseAllKeys)

    const resizeObserver = new ResizeObserver(this.resize)
    resizeObserver.observe(this.container)
    this.cleanups.push(() => resizeObserver.disconnect())

    const visibility = new IntersectionObserver(([entry]) => {
      this.visible = entry?.isIntersecting ?? true
      if (this.visible) this.requestRender()
      else this.releaseAllKeys()
    })
    visibility.observe(this.container)
    this.cleanups.push(() => visibility.disconnect())

    this.caretTimer = window.setInterval(() => {
      if (!this.visible || this.painter.power === 0) return
      this.painter.caretVisible = !this.painter.caretVisible
      this.markScreenDirty()
    }, CARET_INTERVAL)
  }

  private pick(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(this.pointer, this.camera)
    return this.raycaster.intersectObjects(this.model.pickables, false)[0] ?? null
  }

  private onPointerDown = (event: PointerEvent) => {
    if (this.pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return
    this.pointerId = event.pointerId
    this.downX = event.clientX
    this.downY = event.clientY
    this.markInteracted()

    const hit = this.pick(event)
    const code = hit?.object.userData.code as string | undefined
    if (hit && code) {
      this.mode = { kind: 'key', code }
      this.pressKey(code)
      if (code !== 'Power' && code !== 'Touchpad') this.painter.type(code, characters.get(code) ?? null)
      this.markScreenDirty()
      return
    }

    if (hit && this.model.lidParts.includes(hit.object)) {
      const local = this.model.root.worldToLocal(hit.point.clone())
      const radius = Math.hypot(local.y - HINGE.y, local.z - HINGE.z)
      const link =
        hit.object.userData.part === 'screen' && hit.uv && this.painter.power > 0.5
          ? this.painter.linkAt(hit.uv.x, hit.uv.y)
          : null
      this.mode = { kind: 'lid', dragging: false, radius: Math.max(radius, 2), link }
      return
    }

    this.mode = {
      kind: 'orbit',
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      vAzimuth: 0,
      vPolar: 0,
    }
    this.container.dataset.grabbing = 'true'
    this.requestRender()
  }

  private onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId) return
    const mode = this.mode

    if (mode.kind === 'orbit') {
      const dx = event.clientX - mode.lastX
      const dy = event.clientY - mode.lastY
      const dt = Math.max(1, event.timeStamp - mode.lastTime) / 1000
      const dAzimuth = -dx * ORBIT_SPEED
      // Touch keeps vertical swipes for page scroll, so only mice tilt.
      const dPolar = event.pointerType === 'mouse' ? -dy * ORBIT_SPEED : 0
      this.azimuth.value += dAzimuth
      this.azimuth.target = this.azimuth.value
      this.polar.value = THREE.MathUtils.clamp(this.polar.value + dPolar, POLAR_MIN, POLAR_MAX)
      this.polar.target = this.polar.value
      // Smoothed velocity, for the throw on release.
      mode.vAzimuth = mode.vAzimuth * 0.6 + (dAzimuth / dt) * 0.4
      mode.vPolar = mode.vPolar * 0.6 + (dPolar / dt) * 0.4
      mode.lastX = event.clientX
      mode.lastY = event.clientY
      mode.lastTime = event.timeStamp
      this.requestRender()
      return
    }

    if (mode.kind === 'lid') {
      if (!mode.dragging) {
        if (Math.hypot(event.clientX - this.downX, event.clientY - this.downY) < DRAG_THRESHOLD) return
        mode.dragging = true
        this.lidDragging = true
        this.container.dataset.grabbing = 'true'
      }
      const angle = this.lidAngleAt(event, mode.radius)
      if (angle !== null) this.setLidTarget(angle)
    }
  }

  private onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId) return
    this.pointerId = null
    const mode = this.mode
    this.mode = { kind: 'idle' }
    delete this.container.dataset.grabbing

    if (mode.kind === 'orbit') {
      // Keep the throw: coast to where the velocity would carry it.
      const recent = event.timeStamp - mode.lastTime < 80
      if (recent && !this.reducedMotion) {
        this.azimuth.target = this.azimuth.value + THREE.MathUtils.clamp(mode.vAzimuth * 0.28, -2.5, 2.5)
        this.polar.target = THREE.MathUtils.clamp(this.polar.value + mode.vPolar * 0.2, POLAR_MIN, POLAR_MAX)
      }
    } else if (mode.kind === 'key') {
      this.releaseKey(mode.code)
      if (mode.code === 'Power' && event.type === 'pointerup') this.toggleScreen()
    } else if (mode.kind === 'lid') {
      if (mode.dragging) {
        this.lidDragging = false
        this.setLidTarget(this.lid.target < LID_LATCH ? 0 : this.lid.target)
      } else if (mode.link && event.type === 'pointerup') {
        window.open(mode.link, '_blank', 'noopener,noreferrer')
      } else if (event.type === 'pointerup' && this.lid.target < LID_LATCH) {
        // A tap on the closed lid opens it.
        this.setLidTarget(OPEN_ANGLE)
      }
    }
    this.requestRender()
  }

  private onHover = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || this.pointerId !== null) return
    const hit = this.pick(event)
    let cursor: string | null = null
    let link: string | null = null
    if (hit?.object.userData.code) cursor = 'pointer'
    else if (hit && this.model.lidParts.includes(hit.object)) {
      link =
        hit.object.userData.part === 'screen' && hit.uv && this.painter.power > 0.5
          ? this.painter.linkAt(hit.uv.x, hit.uv.y)
          : null
      cursor = link ? 'pointer' : 'ns-resize'
    }
    this.setHover(cursor, link)
  }

  private setHover(cursor: string | null, link: string | null) {
    if (cursor) this.container.dataset.cursor = cursor
    else delete this.container.dataset.cursor
    if (this.painter.hoveredUrl !== link) {
      this.painter.hoveredUrl = link
      this.markScreenDirty()
    }
  }

  /**
   * The lid angle that puts the grabbed point under the pointer: the pointer
   * ray meets the cylinder of the grab radius around the hinge axis.
   */
  private lidAngleAt(event: PointerEvent, radius: number): number | null {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const inverse = this.model.root.matrixWorld.clone().invert()
    const ray = this.raycaster.ray.clone().applyMatrix4(inverse)
    const oy = ray.origin.y - HINGE.y
    const oz = ray.origin.z - HINGE.z
    const { y: dy, z: dz } = ray.direction
    const a = dy * dy + dz * dz
    if (a < 1e-6) return null
    const b = 2 * (oy * dy + oz * dz)
    const c = oy * oy + oz * oz - radius * radius
    const disc = b * b - 4 * a * c
    // Missed the cylinder: use the ray's closest approach to the axis instead.
    const t = disc >= 0 ? (-b - Math.sqrt(disc)) / (2 * a) : -b / (2 * a)
    const y = oy + dy * t
    const z = oz + dz * t
    // Openness: 0 when the lid lies forward on the deck, 90° when upright.
    let angle = Math.atan2(y, z)
    if (angle < -Math.PI / 2) angle += Math.PI * 2
    return THREE.MathUtils.clamp(angle, 0, LID_MAX)
  }

  // ── Keys ────────────────────────────────────────────────────────────────

  private pressKey(code: string) {
    const key = this.model.keys.get(code)
    if (!key) return
    key.target = code === 'Touchpad' ? 0.035 : KEY_TRAVEL
    this.kick(key)
  }

  private releaseKey(code: string) {
    const key = this.model.keys.get(code)
    if (!key) return
    key.target = 0
    this.kick(key)
  }

  private kick(key: LaptopKey) {
    if (this.reducedMotion) {
      key.offset = key.target
      key.velocity = 0
    }
    this.requestRender()
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!this.visible || event.ctrlKey || event.metaKey || isEditable(event.target)) return
    if (!this.model.keys.has(event.code)) return
    if (!this.heldKeys.has(event.code)) {
      this.heldKeys.add(event.code)
      this.pressKey(event.code)
    }
    this.painter.type(event.code, event.key.length === 1 ? event.key : null)
    this.markScreenDirty()
  }

  private onKeyUp = (event: KeyboardEvent) => {
    if (!this.heldKeys.delete(event.code)) return
    this.releaseKey(event.code)
  }

  private releaseAllKeys = () => {
    for (const code of this.heldKeys) this.releaseKey(code)
    this.heldKeys.clear()
  }
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement)
  )
}
