'use client'

import { useEffect, useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'
import { hasHardwareWebGL } from '@/utils/webglSupport'

import { NEURO_NOISE_FRAGMENT, NEURO_NOISE_VERTEX } from './neuroNoiseShader'

// Recipe values, packed exactly as the shader header lists them.
/** The recipe's palette, low → high. */
export const NEURO_NOISE_BLUE = ['#000000', '#1F51FF', '#00E5FF', '#EAFDFF'] as const
const MAX_COLORS = 8
const TIME_SCALE = 0.86
const SHAPE = [1.26, 0.35, 0.28, 0.0] as const
const SURFACE = [1.82, 1.0, -0.03, 1.48] as const
const FINISH = [0.09, 0.0, 0.001, 0.1] as const
const TRANSFORM = [1.0, 0.0, 0.2, 0.0] as const
const CURSOR_EFFECT_RIPPLE = 3.0
const CURSOR_STRENGTH = 0.45
const CURSOR_RADIUS = 0.46

const MAX_DPR = 2

/** Packs hex colours into the shader's u_colors[8] (unused slots stay black). */
function packColors(colors: readonly string[]): Float32Array {
  const packed = new Float32Array(MAX_COLORS * 3)
  colors.slice(0, MAX_COLORS).forEach((hex, index) => {
    const value = Number.parseInt(hex.replace('#', ''), 16)
    packed[index * 3] = ((value >> 16) & 255) / 255
    packed[index * 3 + 1] = ((value >> 8) & 255) / 255
    packed[index * 3 + 2] = (value & 255) / 255
  })
  return packed
}
/** How fast the ripple fades in and out when the pointer enters or leaves (per second). */
const PRESENCE_RATE = 5
/** Time used for the single still frame under reduced motion. */
const STILL_TIME = 12

interface PendingProgram {
  program: WebGLProgram
  vertex: WebGLShader
  fragment: WebGLShader
}

/**
 * Starts compiling and linking without asking for the result: any status query
 * makes the page wait for the GPU, and this shader takes a while to compile.
 */
function buildProgram(gl: WebGLRenderingContext): PendingProgram | null {
  const vertex = gl.createShader(gl.VERTEX_SHADER)
  const fragment = gl.createShader(gl.FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null
  gl.shaderSource(vertex, NEURO_NOISE_VERTEX)
  gl.shaderSource(fragment, NEURO_NOISE_FRAGMENT)
  gl.compileShader(vertex)
  gl.compileShader(fragment)
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  return { program, vertex, fragment }
}

/** Reads the link result once the GPU is done, logging why it failed if it did. */
function finishProgram(gl: WebGLRenderingContext, { program, vertex, fragment }: PendingProgram) {
  const linked = Boolean(gl.getProgramParameter(program, gl.LINK_STATUS))
  if (!linked) {
    console.error(
      'Neuro Noise program:',
      gl.getShaderInfoLog(vertex),
      gl.getShaderInfoLog(fragment),
      gl.getProgramInfoLog(program),
    )
    gl.deleteProgram(program)
  }
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  return linked ? program : null
}

interface NeuroNoiseBackgroundProps {
  className?: string
  /** Palette low → high, up to 8 colours. Defaults to the recipe's blues. */
  colors?: readonly string[]
}

/**
 * Animated "Neuro Noise" WebGL background, adapted from Paper Shaders
 * (https://shaders.paper.design/neuro-noise, Apache-2.0).
 * Fills its positioned parent; the parent's own background shows if WebGL is unavailable.
 */
export function NeuroNoiseBackground({ className, colors = NEURO_NOISE_BLUE }: NeuroNoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  // A string key keeps the effect stable when callers pass a new array with the same colours.
  const colorKey = colors.join(',')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Rendered on the CPU, this full-screen shader would redraw at a frame or two
    // per second and hold up the page; a still glow in its palette stands in.
    if (!hasHardwareWebGL()) {
      layerRef.current?.setAttribute('data-still', '')
      return
    }
    const palette = colorKey.split(',')
    const packedColors = packColors(palette)
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return

    // With KHR_parallel_shader_compile the GPU compiles in the background and
    // reports when it's done, so the page never waits on it.
    const parallel = gl.getExtension('KHR_parallel_shader_compile')
    let pending: PendingProgram | null = null
    let readyFrame = 0
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
      pending = buildProgram(gl)
      awaitProgram()
    }

    const awaitProgram = () => {
      if (!pending) return
      if (parallel && !gl.getProgramParameter(pending.program, parallel.COMPLETION_STATUS_KHR)) {
        readyFrame = requestAnimationFrame(awaitProgram)
        return
      }
      program = finishProgram(gl, pending)
      pending = null
      if (!program) return
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
      gl.uniform3fv(uniforms.u_colors!, packedColors)
      gl.uniform4f(uniforms.u_shape!, ...SHAPE)
      gl.uniform4f(uniforms.u_surface!, ...SURFACE)
      gl.uniform4f(uniforms.u_finish!, ...FINISH)
      gl.uniform4f(uniforms.u_transform!, ...TRANSFORM)
      if (reducedMotion) draw(STILL_TIME)
      else start()
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
      gl.uniform4f(uniforms.u_scene!, canvas.width, canvas.height, seconds * TIME_SCALE, palette.length)
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

    // A restored context needs its program rebuilt; drawing resumes once it's ready.
    const onContextRestored = () => setup()

    setup()

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

    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
    }

    return () => {
      stop()
      cancelAnimationFrame(readyFrame)
      if (pending) gl.deleteProgram(pending.program)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      if (program) gl.deleteProgram(program)
    }
  }, [reducedMotion, colorKey])

  return (
    <div
      aria-hidden="true"
      className={cn('neuro-noise-layer pointer-events-none absolute inset-0', className)}
      ref={layerRef}
    >
      <canvas className="neuro-noise block size-full" ref={canvasRef} />
    </div>
  )
}
