const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|softpipe|software|basic render/i

/** True when a WebGL renderer name belongs to a CPU rasterizer rather than a GPU. */
export function isSoftwareRenderer(name: string): boolean {
  return SOFTWARE_RENDERERS.test(name)
}

let hardware: boolean | undefined

/**
 * Whether WebGL runs on a real GPU. Software rasterizers (SwiftShader, llvmpipe)
 * can draw the hero's shaders, but at a frame or two per second while blocking
 * the page, so callers show their still version instead. They are refused through
 * `failIfMajorPerformanceCaveat` and, as a backstop, by renderer name.
 */
export function hasHardwareWebGL(): boolean {
  if (hardware !== undefined) return hardware
  hardware = false
  try {
    const canvas = document.createElement('canvas')
    const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true }
    const gl = canvas.getContext('webgl2', options) ?? canvas.getContext('webgl', options)
    if (gl) {
      hardware = !isSoftwareRenderer(rendererName(gl))
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    hardware = false
  }
  return hardware
}

function rendererName(gl: WebGLRenderingContext | WebGL2RenderingContext): string {
  const name = String(gl.getParameter(gl.RENDERER))
  // Chromium and Safari mask RENDERER; the real name comes from the debug extension.
  if (!/^webkit webgl$/i.test(name)) return name
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : name
}
