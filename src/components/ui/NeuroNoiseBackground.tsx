'use client'

import { useEffect, useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

import { NEURO_NOISE_FRAGMENT, NEURO_NOISE_VERTEX } from './neuroNoiseShader'

// Recipe values, packed exactly as the shader header lists them.
// Colours low → high: #000000, #1F51FF, #00E5FF, #EAFDFF (the last 4 slots unused).
const COLORS = new Float32Array([
  0.0, 0.0, 0.0,
  0.122, 0.318, 1.0,
  0.0, 0.898, 1.0,
  0.918, 0.992, 1.0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
])
const COLOR_COUNT = 4
const TIME_SCALE = 0.86
const SHAPE = [1.26, 0.35, 0.28, 0.0] as const
const SURFACE = [1.82, 1.0, -0.03, 1.48] as const
const FINISH = [0.09, 0.0, 0.001, 0.1] as const
const TRANSFORM = [1.0, 0.0, 0.2, 0.0] as const
const CURSOR_EFFECT_RIPPLE = 3.0
const CURSOR_STRENGTH = 0.45
const CURSOR_RADIUS = 0.46

const MAX_DPR = 2
/** How fast the ripple fades in and out when the pointer enters or leaves (per second). */
const PRESENCE_RATE = 5
/** Time used for the single still frame under reduced motion. */
const STILL_TIME = 12

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Neuro Noise shader:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, NEURO_NOISE_VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, NEURO_NOISE_FRAGMENT)
  if (!vertex || !fragment) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Neuro Noise program:', gl.getProgramInfoLog(program))
    return null
  }
  return program
}

interface NeuroNoiseBackgroundProps {
  className?: string
}

/**
 * Animated "Neuro Noise" WebGL background, adapted from Paper Shaders
 * (https://shaders.paper.design/neuro-noise, Apache-2.0).
 * Fills its positioned parent; the parent's own background shows if WebGL is unavailable.
 */
export function NeuroNoiseBackground({ className }: NeuroNoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return

    let program: WebGLProgram | null = null
    let uniforms: Record<string, WebGLUniformLocation | null> = {}
    let frameId = 0
    let lastTime: number | null = null
    let elapsed = 0
    let isOnScreen = true
    let presence = 0
    let targetPresence = 0
    const pointer = { x: 0, y: 0 }

    const setup = () => {
      program = createProgram(gl)
      if (!program) return false
      gl.useProgram(program)

      // One triangle that covers the whole viewport.
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const position = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

      uniforms = Object.fromEntries(
        ['u_colors', 'u_scene', 'u_shape', 'u_surface', 'u_finish', 'u_transform', 'u_space', 'u_cursor'].map(
          (name) => [name, gl.getUniformLocation(program!, name)],
        ),
      )
      gl.uniform3fv(uniforms.u_colors!, COLORS)
      gl.uniform4f(uniforms.u_shape!, ...SHAPE)
      gl.uniform4f(uniforms.u_surface!, ...SURFACE)
      gl.uniform4f(uniforms.u_finish!, ...FINISH)
      gl.uniform4f(uniforms.u_transform!, ...TRANSFORM)
      return true
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const draw = (seconds: number) => {
      if (!program) return
      resize()
      gl.uniform4f(uniforms.u_scene!, canvas.width, canvas.height, seconds * TIME_SCALE, COLOR_COUNT)
      gl.uniform4f(uniforms.u_space!, 0, 0, pointer.x, pointer.y)
      gl.uniform4f(uniforms.u_cursor!, presence, CURSOR_EFFECT_RIPPLE, CURSOR_STRENGTH, CURSOR_RADIUS)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      canvas.dataset.ready = 'true'
    }

    const tick = (time: number) => {
      frameId = requestAnimationFrame(tick)
      const delta = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time
      elapsed += delta
      presence += (targetPresence - presence) * (1 - Math.exp(-delta * PRESENCE_RATE))
      draw(elapsed)
    }

    const start = () => {
      if (frameId || reducedMotion || !program || !isOnScreen || document.hidden) return
      lastTime = null
      frameId = requestAnimationFrame(tick)
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = 0
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      targetPresence = inside && event.pointerType === 'mouse' ? 1 : 0
      if (!inside) return
      // Normalised to -1..1 in canvas space, y up (GL convention).
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = 1 - ((event.clientY - rect.top) / rect.height) * 2
    }

    const onPointerLeave = () => {
      targetPresence = 0
    }

    const onVisibility = () => (document.hidden ? stop() : start())

    const onContextLost = (event: Event) => {
      event.preventDefault()
      stop()
      program = null
    }

    const onContextRestored = () => {
      if (!setup()) return
      if (reducedMotion) draw(STILL_TIME)
      else start()
    }

    if (!setup()) return

    const resizeObserver = new ResizeObserver(() => {
      if (reducedMotion) draw(STILL_TIME)
    })
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isOnScreen = entry?.isIntersecting ?? true
      if (isOnScreen) start()
      else stop()
    })
    intersectionObserver.observe(canvas)

    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)

    if (reducedMotion) {
      draw(STILL_TIME)
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
      start()
    }

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      if (program) gl.deleteProgram(program)
    }
  }, [reducedMotion])

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <canvas className="neuro-noise block size-full" ref={canvasRef} />
    </div>
  )
}
