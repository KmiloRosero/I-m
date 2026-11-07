/**
 * CSS `matrix3d()` that maps a `width` × `height` box (transform-origin 0 0)
 * onto any convex quad: how a flat element is laid onto a photographed screen.
 * Square-to-quad projective mapping (Heckbert, 1989).
 */

export interface QuadPoint {
  x: number
  y: number
}

/** Corners in order: top-left, top-right, bottom-right, bottom-left. */
export type Quad = readonly [QuadPoint, QuadPoint, QuadPoint, QuadPoint]

export function quadMatrix(width: number, height: number, quad: Quad): number[] {
  const [p0, p1, p2, p3] = quad
  const dx1 = p1.x - p2.x
  const dx2 = p3.x - p2.x
  const dx3 = p0.x - p1.x + p2.x - p3.x
  const dy1 = p1.y - p2.y
  const dy2 = p3.y - p2.y
  const dy3 = p0.y - p1.y + p2.y - p3.y

  const det = dx1 * dy2 - dx2 * dy1
  const g = det === 0 ? 0 : (dx3 * dy2 - dx2 * dy3) / det
  const h = det === 0 ? 0 : (dx1 * dy3 - dx3 * dy1) / det

  const a = p1.x - p0.x + g * p1.x
  const b = p3.x - p0.x + h * p3.x
  const d = p1.y - p0.y + g * p1.y
  const e = p3.y - p0.y + h * p3.y

  // Column-major, with the unit square stretched to width × height.
  return [a / width, d / width, 0, g / width, b / height, e / height, 0, h / height, 0, 0, 1, 0, p0.x, p0.y, 0, 1]
}

export function quadTransform(width: number, height: number, quad: Quad): string {
  return `matrix3d(${quadMatrix(width, height, quad)
    .map((value) => Number(value.toFixed(8)))
    .join(',')})`
}

/** Applies a `quadMatrix` to a point of the box, for checks and tests. */
export function projectPoint(matrix: readonly number[], x: number, y: number): QuadPoint {
  const m = (index: number) => matrix[index] ?? 0
  const w = m(3) * x + m(7) * y + m(15)
  return {
    x: (m(0) * x + m(4) * y + m(12)) / w,
    y: (m(1) * x + m(5) * y + m(13)) / w,
  }
}

/** Pushes each corner `amount` px away from the quad's centre, to hide seams. */
export function expandQuad(quad: Quad, amount: number): Quad {
  const cx = quad.reduce((sum, point) => sum + point.x, 0) / 4
  const cy = quad.reduce((sum, point) => sum + point.y, 0) / 4
  const grow = (point: QuadPoint): QuadPoint => {
    const dx = point.x - cx
    const dy = point.y - cy
    const length = Math.hypot(dx, dy) || 1
    return { x: point.x + (dx / length) * amount, y: point.y + (dy / length) * amount }
  }
  return [grow(quad[0]), grow(quad[1]), grow(quad[2]), grow(quad[3])]
}
