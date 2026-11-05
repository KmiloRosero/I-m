/**
 * A lanyard: a strap of point masses pinned at the top, ending in a rigid
 * badge. Verlet integration with distance constraints, so a release keeps the
 * throw's velocity and the badge swings around its clip.
 *
 * Coordinates are CSS px in the stage; y grows downward.
 */

export interface Point {
  x: number
  y: number
}

export interface LanyardLayout {
  /** Where the strap is fixed, usually above the visible area. */
  anchor: Point
  /** Resting position of the badge's clip (the strap's lower end). */
  clip: Point
  /** Clip to the bottom edge of the badge. */
  badgeHeight: number
}

/** A grab point in badge space: `along` px down from the clip, `across` px right of the axis. */
export interface Grip {
  along: number
  across: number
}

const SEGMENTS = 12
const STEP = 1 / 120
const GRAVITY = 2600
/** Velocity kept per step; about 60% per second at 120 Hz. */
const DAMPING = 0.996
const ITERATIONS = 14
/** Badge points are heavier than strap points, so the strap stays taut. */
const STRAP_INV_MASS = 1
const BADGE_INV_MASS = 0.3
/** Cap on movement per step, so a wild fling cannot explode the solver. */
const MAX_STEP_DISTANCE = 48
/** How far past the strap's length a drag may pull the clip. */
const MAX_STRETCH = 1.12

interface Particle {
  x: number
  y: number
  /** Position on the previous step; the difference is the velocity. */
  px: number
  py: number
  invMass: number
}

export class Lanyard {
  /** Strap points from the anchor (first) to the clip (last). */
  readonly strap: readonly Particle[]
  /** Bottom centre of the badge; the badge is rigid between the clip and here. */
  private readonly bottom: Particle
  private readonly particles: readonly Particle[]
  private readonly segment: number
  private readonly badgeHeight: number
  private readonly anchor: Point
  private readonly strapLength: number
  private accumulator = 0
  private grip: Grip | null = null
  private target: Point = { x: 0, y: 0 }

  constructor(layout: LanyardLayout, start: Point = layout.clip) {
    this.anchor = layout.anchor
    this.badgeHeight = layout.badgeHeight
    this.strapLength = Math.hypot(layout.clip.x - layout.anchor.x, layout.clip.y - layout.anchor.y)
    this.segment = this.strapLength / SEGMENTS

    // Lay the strap straight from the anchor to `start`, badge hanging below it.
    this.strap = Array.from({ length: SEGMENTS + 1 }, (_, index) => {
      const t = index / SEGMENTS
      const invMass = index === 0 ? 0 : index === SEGMENTS ? BADGE_INV_MASS : STRAP_INV_MASS
      return particle(lerp(layout.anchor.x, start.x, t), lerp(layout.anchor.y, start.y, t), invMass)
    })
    this.bottom = particle(start.x, start.y + layout.badgeHeight, BADGE_INV_MASS)
    this.particles = [...this.strap, this.bottom]
  }

  private get clipPoint(): Particle {
    return this.strap[SEGMENTS] as Particle
  }

  get clip(): Point {
    return { x: this.clipPoint.x, y: this.clipPoint.y }
  }

  /** Badge rotation in radians; 0 when it hangs straight down. */
  get angle(): number {
    return Math.atan2(-(this.bottom.x - this.clipPoint.x), this.bottom.y - this.clipPoint.y)
  }

  /** Horizontal speed of the badge bottom, in px per second. */
  get swingSpeed(): number {
    return (this.bottom.x - this.bottom.px) / STEP
  }

  get isDragging(): boolean {
    return this.grip !== null
  }

  /** Converts a stage point into badge space, for starting a drag there. */
  gripAt(point: Point): Grip {
    const { axisX, axisY } = this.axis()
    const dx = point.x - this.clipPoint.x
    const dy = point.y - this.clipPoint.y
    return { along: dx * axisX + dy * axisY, across: dx * axisY - dy * axisX }
  }

  grab(grip: Grip, target: Point) {
    this.grip = grip
    this.moveTo(target)
  }

  moveTo(target: Point) {
    // Keep the pull within reach, or the strap would stretch like rubber.
    const reach = this.strapLength * MAX_STRETCH + (this.grip?.along ?? 0)
    const dx = target.x - this.anchor.x
    const dy = target.y - this.anchor.y
    const distance = Math.hypot(dx, dy)
    const scale = distance > reach ? reach / distance : 1
    this.target = { x: this.anchor.x + dx * scale, y: this.anchor.y + dy * scale }
  }

  release() {
    this.grip = null
  }

  /** Gives the badge a sideways push, in px per step. */
  nudge(amount: number) {
    this.bottom.px -= amount
  }

  /**
   * Advances by `seconds` in fixed steps. Returns the largest distance any
   * point moved, so the caller can stop the loop once the badge is at rest.
   */
  advance(seconds: number): number {
    this.accumulator = Math.min(this.accumulator + seconds, STEP * 8)
    let moved = 0
    while (this.accumulator >= STEP) {
      moved = Math.max(moved, this.step())
      this.accumulator -= STEP
    }
    return moved
  }

  private step(): number {
    let moved = 0
    for (const point of this.particles) {
      if (point.invMass === 0) continue
      let vx = (point.x - point.px) * DAMPING
      let vy = (point.y - point.py) * DAMPING + GRAVITY * STEP * STEP
      const speed = Math.hypot(vx, vy)
      if (speed > MAX_STEP_DISTANCE) {
        vx *= MAX_STEP_DISTANCE / speed
        vy *= MAX_STEP_DISTANCE / speed
      }
      point.px = point.x
      point.py = point.y
      point.x += vx
      point.y += vy
      moved = Math.max(moved, Math.abs(vx) + Math.abs(vy))
    }

    for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
      this.strap.forEach((point, index) => {
        const next = this.strap[index + 1]
        if (next) constrain(point, next, this.segment)
      })
      constrain(this.clipPoint, this.bottom, this.badgeHeight)
      if (this.grip) this.pin(this.grip)
    }
    return moved
  }

  /** Moves the whole badge so the gripped point sits under the pointer. */
  private pin(grip: Grip) {
    const { axisX, axisY } = this.axis()
    const clip = this.clipPoint
    const dx = this.target.x - (clip.x + axisX * grip.along + axisY * grip.across)
    const dy = this.target.y - (clip.y + axisY * grip.along - axisX * grip.across)
    for (const point of [clip, this.bottom]) {
      point.x += dx
      point.y += dy
    }
  }

  /** Unit vector from the clip to the badge bottom. */
  private axis() {
    const dx = this.bottom.x - this.clipPoint.x
    const dy = this.bottom.y - this.clipPoint.y
    const length = Math.hypot(dx, dy) || 1
    return { axisX: dx / length, axisY: dy / length }
  }
}

function particle(x: number, y: number, invMass: number): Particle {
  return { x, y, px: x, py: y, invMass }
}

/** Moves two points toward (or away from) each other until they are `length` apart. */
function constrain(a: Particle, b: Particle, length: number) {
  const weight = a.invMass + b.invMass
  if (weight === 0) return
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distance = Math.hypot(dx, dy) || 1e-6
  const correction = (distance - length) / distance / weight
  a.x += dx * correction * a.invMass
  a.y += dy * correction * a.invMass
  b.x -= dx * correction * b.invMass
  b.y -= dy * correction * b.invMass
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t
}

/** SVG path through the strap points, smoothed with quadratic curves between midpoints. */
export function strapPath(lanyard: Lanyard): string {
  const points = lanyard.strap
  const format = (value: number) => value.toFixed(1)
  return points
    .map((point, index) => {
      if (index === 0) return `M${format(point.x)} ${format(point.y)}`
      const next = points[index + 1]
      if (!next) return `L${format(point.x)} ${format(point.y)}`
      return `Q${format(point.x)} ${format(point.y)} ${format((point.x + next.x) / 2)} ${format((point.y + next.y) / 2)}`
    })
    .join(' ')
}
