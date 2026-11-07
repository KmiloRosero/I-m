/**
 * A floating laptop as a damped spring body. It rests at the origin, follows
 * the pointer through a stiff spring while dragged, keeps the throw's velocity
 * on release and swings back. Horizontal acceleration makes it sway like
 * something with weight, and its 3D tilt leans toward the hover point and
 * into the direction of travel.
 *
 * Positions are CSS px offsets from the resting place; y grows downward;
 * angles are degrees.
 */

export interface Vec {
  x: number
  y: number
}

const STEP = 1 / 120
/** Spring back to the resting place: underdamped, so it overshoots once. */
const REST_STIFFNESS = 120
const REST_DAMPING = 8
/** Spring toward the pointer while dragged: stiff, a hint of lag. */
const DRAG_STIFFNESS = 900
const DRAG_DAMPING = 58
/** Sway: its own spring, driven by horizontal acceleration. */
const SWAY_STIFFNESS = 110
const SWAY_DAMPING = 9
const SWAY_PER_ACCELERATION = 0.1
const MAX_SWAY = 16
/** 3D tilt spring and limits. */
const TILT_STIFFNESS = 140
const TILT_DAMPING = 17
const HOVER_TILT = 7
const TILT_PER_SPEED = 0.006
const MAX_TILT = 14
/** Speed cap (px/s), so a wild fling cannot launch it off the page. */
const MAX_SPEED = 4200

interface Spring {
  value: number
  velocity: number
}

function spring(value = 0, velocity = 0): Spring {
  return { value, velocity }
}

export interface LaptopStart {
  x?: number
  y?: number
  vx?: number
  vy?: number
  angle?: number
}

export class LaptopBody {
  private readonly px: Spring
  private readonly py: Spring
  private readonly sway: Spring
  private readonly tiltX = spring()
  private readonly tiltY = spring()
  private accumulator = 0
  private grip: Vec | null = null
  private target: Vec = { x: 0, y: 0 }
  private hoverPoint: Vec | null = null
  private reach: Vec = { x: 240, y: 160 }

  constructor(start: LaptopStart = {}) {
    this.px = spring(start.x ?? 0, start.vx ?? 0)
    this.py = spring(start.y ?? 0, start.vy ?? 0)
    this.sway = spring(start.angle ?? 0)
  }

  get position(): Vec {
    return { x: this.px.value, y: this.py.value }
  }

  get angle(): number {
    return this.sway.value
  }

  /** Lean in degrees: x tips the top away (rotateX), y turns it (rotateY). */
  get tilt(): Vec {
    return { x: this.tiltX.value, y: this.tiltY.value }
  }

  get isDragging(): boolean {
    return this.grip !== null
  }

  /** How far a drag can pull it, per axis, before the pull fades out. */
  setReach(reach: Vec) {
    this.reach = { x: Math.max(1, reach.x), y: Math.max(1, reach.y) }
  }

  /** Starts a drag at `pointer`, in the same offset space as `position`. */
  grab(pointer: Vec) {
    this.grip = { x: pointer.x - this.px.value, y: pointer.y - this.py.value }
    this.moveTo(pointer)
  }

  moveTo(pointer: Vec) {
    if (!this.grip) return
    this.target = {
      x: rubberBand(pointer.x - this.grip.x, this.reach.x),
      y: rubberBand(pointer.y - this.grip.y, this.reach.y),
    }
  }

  release() {
    this.grip = null
    this.target = { x: 0, y: 0 }
  }

  /** Pointer over the laptop, from -1 to 1 on each axis from its centre; null when it leaves. */
  hover(point: Vec | null) {
    this.hoverPoint = point && { x: clamp(point.x, -1, 1), y: clamp(point.y, -1, 1) }
  }

  /** A small hop with a twist, for a tap. */
  hop(direction = 1) {
    this.py.velocity -= 520
    this.sway.velocity += 70 * direction
  }

  /** Advances by `seconds` in fixed steps. */
  advance(seconds: number) {
    this.accumulator = Math.min(this.accumulator + seconds, STEP * 8)
    while (this.accumulator >= STEP) {
      this.step()
      this.accumulator -= STEP
    }
  }

  /** True once nothing is moving and no drag is held; the caller can stop its loop. */
  get atRest(): boolean {
    if (this.grip) return false
    const tiltTarget = this.tiltTarget()
    return (
      Math.abs(this.px.value) < 0.3 &&
      Math.abs(this.py.value) < 0.3 &&
      Math.abs(this.sway.value) < 0.05 &&
      Math.abs(this.tiltX.value - tiltTarget.x) < 0.05 &&
      Math.abs(this.tiltY.value - tiltTarget.y) < 0.05 &&
      Math.hypot(this.px.velocity, this.py.velocity) < 2 &&
      Math.abs(this.sway.velocity) < 0.5 &&
      Math.abs(this.tiltX.velocity) + Math.abs(this.tiltY.velocity) < 0.5
    )
  }

  /** Snaps the remaining sub-pixel motion away, so the resting pose is exact. */
  settle() {
    for (const s of [this.px, this.py, this.sway]) {
      s.value = 0
      s.velocity = 0
    }
    const tiltTarget = this.tiltTarget()
    this.tiltX.value = tiltTarget.x
    this.tiltY.value = tiltTarget.y
    this.tiltX.velocity = 0
    this.tiltY.velocity = 0
  }

  private tiltTarget(): Vec {
    const hover = this.hoverPoint ?? { x: 0, y: 0 }
    return {
      x: clamp(-hover.y * HOVER_TILT - this.py.velocity * TILT_PER_SPEED * 0.6, -MAX_TILT, MAX_TILT),
      y: clamp(hover.x * HOVER_TILT + this.px.velocity * TILT_PER_SPEED, -MAX_TILT, MAX_TILT),
    }
  }

  private step() {
    const stiffness = this.grip ? DRAG_STIFFNESS : REST_STIFFNESS
    const damping = this.grip ? DRAG_DAMPING : REST_DAMPING

    const ax = stiffness * (this.target.x - this.px.value) - damping * this.px.velocity
    const ay = stiffness * (this.target.y - this.py.value) - damping * this.py.velocity
    this.px.velocity += ax * STEP
    this.py.velocity += ay * STEP
    const speed = Math.hypot(this.px.velocity, this.py.velocity)
    if (speed > MAX_SPEED) {
      this.px.velocity *= MAX_SPEED / speed
      this.py.velocity *= MAX_SPEED / speed
    }
    this.px.value += this.px.velocity * STEP
    this.py.value += this.py.velocity * STEP

    // Accelerating right leaves the body behind: it leans the other way.
    const swayAcceleration =
      -SWAY_STIFFNESS * this.sway.value - SWAY_DAMPING * this.sway.velocity - ax * SWAY_PER_ACCELERATION
    this.sway.velocity += swayAcceleration * STEP
    this.sway.value = clamp(this.sway.value + this.sway.velocity * STEP, -MAX_SWAY, MAX_SWAY)
    if (Math.abs(this.sway.value) === MAX_SWAY) this.sway.velocity *= 0.5

    const tiltTarget = this.tiltTarget()
    for (const [s, target] of [
      [this.tiltX, tiltTarget.x],
      [this.tiltY, tiltTarget.y],
    ] as const) {
      s.velocity += (TILT_STIFFNESS * (target - s.value) - TILT_DAMPING * s.velocity) * STEP
      s.value += s.velocity * STEP
    }
  }
}

/** Follows `distance` 1:1 up to half of `reach`, then eases toward `reach` without passing it. */
export function rubberBand(distance: number, reach: number): number {
  const knee = reach / 2
  const magnitude = Math.abs(distance)
  if (magnitude <= knee) return distance
  const soft = reach - knee
  return Math.sign(distance) * (knee + soft * (1 - Math.exp(-(magnitude - knee) / soft)))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
