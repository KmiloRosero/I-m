/**
 * Draws the laptop's display (the profile page) on a canvas used as the
 * screen texture. Keeps the link areas so a click on the 3D screen can
 * open them, and a terminal line that echoes what the visitor types.
 */

export interface ScreenLink {
  label: string
  url: string
}

export interface ScreenContent {
  name: string
  title: string
  meta: string
  stack: string[]
  links: ScreenLink[]
  photoSrc: string
  fonts: { display: string; body: string; mono: string }
}

interface HitArea {
  x: number
  y: number
  width: number
  height: number
  url: string
}

export const SCREEN_WIDTH = 1600
export const SCREEN_HEIGHT = 900
const TERMINAL_LIMIT = 34
const IDLE_COMMAND = 'npm run dev'

const COLORS = {
  cyan: '#00e5ff',
  electric: '#1f51ff',
  green: '#22c55e',
  white: '#ffffff',
  black: '#050505',
}

export class ScreenPainter {
  readonly canvas: HTMLCanvasElement
  private readonly context: CanvasRenderingContext2D
  private readonly content: ScreenContent
  private photo: HTMLImageElement | null = null
  private hits: HitArea[] = []
  private typed = ''
  private submitted = false
  /** 0 = off, 1 = fully on; the boot flash peaks in between. */
  power = 0
  caretVisible = true
  hoveredUrl: string | null = null

  constructor(content: ScreenContent, onImageLoad: () => void) {
    this.content = content
    this.canvas = document.createElement('canvas')
    this.canvas.width = SCREEN_WIDTH
    this.canvas.height = SCREEN_HEIGHT
    const context = this.canvas.getContext('2d')
    if (!context) throw new Error('2D canvas unavailable')
    this.context = context

    const photo = new Image()
    photo.decoding = 'async'
    photo.onload = () => {
      this.photo = photo
      onImageLoad()
    }
    photo.src = content.photoSrc
  }

  /** A key pressed on the model: printable characters go to the terminal. */
  type(code: string, character: string | null) {
    if (code === 'Backspace') {
      this.typed = this.typed.slice(0, -1)
      this.submitted = false
      return
    }
    if (code === 'Enter') {
      this.submitted = this.typed.length > 0
      if (!this.submitted) this.typed = ''
      return
    }
    if (!character || character.length !== 1) return
    if (this.submitted) {
      this.typed = ''
      this.submitted = false
    }
    this.typed = (this.typed + character).slice(-TERMINAL_LIMIT)
  }

  /** The link under a point given in texture UV (v grows upward). */
  linkAt(u: number, v: number): string | null {
    const x = u * SCREEN_WIDTH
    const y = (1 - v) * SCREEN_HEIGHT
    const hit = this.hits.find(
      (area) => x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height,
    )
    return hit?.url ?? null
  }

  draw() {
    const ctx = this.context
    const { fonts } = this.content
    ctx.save()
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    // Backdrop: deep blue with the site's electric and cyan glows.
    const base = ctx.createLinearGradient(0, 0, SCREEN_WIDTH * 0.6, SCREEN_HEIGHT)
    base.addColorStop(0, '#0a1440')
    base.addColorStop(0.6, '#03061a')
    base.addColorStop(1, '#03061a')
    ctx.fillStyle = base
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    glow(ctx, SCREEN_WIDTH, 0, 900, 'rgba(31, 81, 255, 0.55)')
    glow(ctx, 0, SCREEN_HEIGHT, 700, 'rgba(0, 229, 255, 0.16)')

    this.drawBar()
    this.drawPhoto()
    this.drawInfo()
    this.drawTerminal(fonts.mono)

    // Power: black when off, with a short bright flash while it boots.
    if (this.power < 1) {
      const flash = Math.max(0, 1 - Math.abs(this.power - 0.35) / 0.35) * 0.35
      ctx.fillStyle = `rgba(2, 3, 10, ${(1 - Math.min(1, this.power * 1.6)).toFixed(3)})`
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
      if (flash > 0) {
        ctx.fillStyle = `rgba(190, 240, 255, ${flash.toFixed(3)})`
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
      }
    }
    ctx.restore()
  }

  private drawBar() {
    const ctx = this.context
    const { fonts } = this.content
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)'
    ctx.fillRect(0, 0, SCREEN_WIDTH, 76)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, 76, SCREEN_WIDTH, 2)

    ;['#ff5f57', '#febc2e', '#28c840'].forEach((color, index) => {
      ctx.beginPath()
      ctx.arc(52 + index * 38, 38, 12, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    })

    roundRect(ctx, 210, 18, 1050, 40, 20)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fill()
    ctx.font = `700 26px ${fonts.display}`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('portafolio / kmilo', 735, 39)

    ctx.textAlign = 'right'
    ctx.fillStyle = '#86efac'
    ctx.font = `800 26px ${fonts.display}`
    ctx.fillText('EN LÍNEA', SCREEN_WIDTH - 48, 39)
    const labelWidth = ctx.measureText('EN LÍNEA').width
    ctx.beginPath()
    ctx.arc(SCREEN_WIDTH - 48 - labelWidth - 20, 39, 9, 0, Math.PI * 2)
    ctx.fillStyle = COLORS.green
    ctx.shadowColor = COLORS.green
    ctx.shadowBlur = 16
    ctx.fill()
    ctx.shadowBlur = 0
  }

  private drawPhoto() {
    const ctx = this.context
    const x = 70
    const y = 112
    const width = 536
    const height = 670

    // Offset block shadow, then the cyan ring.
    roundRect(ctx, x + 26, y + 26, width, height, 40)
    ctx.fillStyle = 'rgba(31, 81, 255, 0.95)'
    ctx.fill()
    roundRect(ctx, x - 8, y - 8, width + 16, height + 16, 46)
    ctx.fillStyle = COLORS.cyan
    ctx.fill()

    ctx.save()
    roundRect(ctx, x, y, width, height, 38)
    ctx.clip()
    ctx.fillStyle = '#1f51ff'
    ctx.fillRect(x, y, width, height)
    if (this.photo) {
      // object-fit: cover, focused at 50% 25%.
      const { naturalWidth: iw, naturalHeight: ih } = this.photo
      const scale = Math.max(width / iw, height / ih)
      const sw = width / scale
      const sh = height / scale
      ctx.drawImage(this.photo, (iw - sw) * 0.5, (ih - sh) * 0.25, sw, sh, x, y, width, height)
    }
    ctx.restore()
  }

  private drawInfo() {
    const ctx = this.context
    const { fonts, name, title, meta, stack, links } = this.content
    const left = 676
    const maxWidth = SCREEN_WIDTH - left - 60
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    ctx.fillStyle = COLORS.cyan
    ctx.font = `800 38px ${fonts.display}`
    ctx.letterSpacing = '7px'
    ctx.fillText('HOLA, SOY', left, 228)
    ctx.letterSpacing = '0px'

    ctx.fillStyle = COLORS.white
    const nameSize = fitText(ctx, name.toUpperCase(), maxWidth, 128, (size) => `900 ${size}px ${fonts.display}`)
    ctx.fillText(name.toUpperCase(), left, 228 + nameSize * 0.98)

    let y = 228 + nameSize + 72
    ctx.font = `800 56px ${fonts.display}`
    ctx.fillText(title, left, y)

    y += 58
    ctx.font = `400 34px ${fonts.body}`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)'
    ctx.fillText(meta, left, y)

    // Stack chips.
    y += 40
    let x = left
    ctx.font = `700 28px ${fonts.display}`
    for (const item of stack) {
      const width = ctx.measureText(item).width + 44
      if (x + width > left + maxWidth) break
      roundRect(ctx, x, y, width, 52, 26)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
      ctx.textBaseline = 'middle'
      ctx.fillText(item, x + 22, y + 27)
      ctx.textBaseline = 'alphabetic'
      x += width + 16
    }

    // Link buttons: cyan with an electric offset, white when hovered.
    y += 92
    x = left
    this.hits = []
    ctx.font = `900 36px ${fonts.display}`
    for (const link of links) {
      const label = `${link.label} ↗`
      const width = ctx.measureText(label).width + 64
      const height = 76
      if (x + width > left + maxWidth) break
      roundRect(ctx, x + 10, y + 10, width, height, 18)
      ctx.fillStyle = COLORS.electric
      ctx.fill()
      roundRect(ctx, x, y, width, height, 18)
      ctx.fillStyle = this.hoveredUrl === link.url ? COLORS.white : COLORS.cyan
      ctx.fill()
      ctx.fillStyle = COLORS.black
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x + 32, y + height / 2 + 2)
      ctx.textBaseline = 'alphabetic'
      this.hits.push({ x, y, width: width + 10, height: height + 10, url: link.url })
      x += width + 34
    }
  }

  private drawTerminal(mono: string) {
    const ctx = this.context
    const top = SCREEN_HEIGHT - 84
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
    ctx.fillRect(0, top, SCREEN_WIDTH, 84)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fillRect(0, top, SCREEN_WIDTH, 2)

    ctx.font = `500 32px ${mono}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    const mid = top + 44
    let x = 48
    ctx.fillStyle = COLORS.cyan
    ctx.fillText('~/portafolio $', x, mid)
    x += ctx.measureText('~/portafolio $ ').width

    const command = this.typed || IDLE_COMMAND
    ctx.fillStyle = this.typed ? COLORS.white : 'rgba(255, 255, 255, 0.82)'
    ctx.fillText(command, x, mid)
    x += ctx.measureText(command).width

    if (!this.typed || this.submitted) {
      const done = this.submitted ? '  ✓ recibido' : '  ✓ listo'
      ctx.fillStyle = '#86efac'
      ctx.fillText(done, x, mid)
      x += ctx.measureText(done).width
    }
    if (this.caretVisible) {
      ctx.fillStyle = COLORS.white
      ctx.fillRect(x + 8, mid - 18, 16, 36)
    }
  }
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
}

/** Largest font size, up to `max`, at which `text` fits in `width`. Leaves that font set. */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  max: number,
  font: (size: number) => string,
): number {
  let size = max
  ctx.font = font(size)
  while (size > 24 && ctx.measureText(text).width > width) {
    size -= 4
    ctx.font = font(size)
  }
  return size
}
