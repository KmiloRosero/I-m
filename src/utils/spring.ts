/** A damped spring on one value: the building block of the laptop's motion. */
export interface Spring {
  value: number
  velocity: number
  target: number
}

export function createSpring(value: number, target = value): Spring {
  return { value, velocity: 0, target }
}

/** Advances one step of `dt` seconds (semi-implicit Euler, stable at small steps). */
export function stepSpring(spring: Spring, stiffness: number, damping: number, dt: number) {
  spring.velocity += (stiffness * (spring.target - spring.value) - damping * spring.velocity) * dt
  spring.value += spring.velocity * dt
}

export function isSpringSettled(spring: Spring, epsilon = 1e-3): boolean {
  return Math.abs(spring.target - spring.value) < epsilon && Math.abs(spring.velocity) < epsilon * 10
}

export function settleSpring(spring: Spring) {
  spring.value = spring.target
  spring.velocity = 0
}

/** The target an angle spring should take to reach `angle` the short way round (radians). */
export function nearestAngle(from: number, angle: number): number {
  const turn = Math.PI * 2
  return from + ((((angle - from) % turn) + turn * 1.5) % turn) - Math.PI
}
