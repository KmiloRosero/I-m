import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { brandColors } from '@/data/brandColors'
import { getPersonalInfo } from '@/data/personalInfo'
import { translator, type Locale } from '@/i18n/config'
import type { Project, ProjectImage } from '@/types/project'

const DISPLAY_FONT_NAME = 'Anybody'
const DISPLAY_FONT_CSS_URL = 'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@150,800'
const FONT_FILE_PATTERN = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/

export const ogImageSize = { height: 630, width: 1200 }

async function loadDisplayFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssResponse = await fetch(`${DISPLAY_FONT_CSS_URL}&text=${encodeURIComponent(text)}`)
    const fontUrl = FONT_FILE_PATTERN.exec(await cssResponse.text())?.[1]
    if (!fontUrl) return null

    return await (await fetch(fontUrl)).arrayBuffer()
  } catch {
    return null
  }
}

/** The site's share card, shared by each language's `opengraph-image` route. */
export async function renderOgImage(locale: Locale) {
  const { firstName, lastName, position, studies } = getPersonalInfo(locale)
  const fontData = await loadDisplayFont(`${firstName}${lastName}${studies}${position}`)
  const fontFamily = fontData ? DISPLAY_FONT_NAME : 'sans-serif'
  const nameStyle = { display: 'flex', fontFamily, fontSize: 112, fontWeight: 800, lineHeight: 1 }
  const roleStyle = { display: 'flex', fontFamily, fontSize: 26, fontWeight: 800 }

  return new ImageResponse(
    <div style={{ background: brandColors.cobalt, display: 'flex', height: '100%', width: '100%' }}>
      <div
        style={{
          color: brandColors.white,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 64,
          paddingRight: 24,
          width: 860,
        }}
      >
        <div style={nameStyle}>{firstName}</div>
        <div style={nameStyle}>{lastName}</div>
        <div style={{ ...roleStyle, marginTop: 32 }}>{studies}</div>
        <div style={{ ...roleStyle, marginTop: 8 }}>{position}</div>
      </div>
      <div style={{ background: brandColors.red, display: 'flex', flexGrow: 1 }}>
        <div style={{ background: brandColors.yellow, display: 'flex', height: 210, width: '100%' }} />
      </div>
    </div>,
    {
      ...ogImageSize,
      fonts: fontData ? [{ data: fontData, name: DISPLAY_FONT_NAME, weight: 800 }] : [],
    },
  )
}

const MIME_TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' }

/** A screenshot from /public as a data URL; the card renderer reads PNG and JPEG. */
async function screenshotData(image: ProjectImage): Promise<string | null> {
  const mime = MIME_TYPES[image.src.split('.').pop()?.toLowerCase() ?? '']
  if (!mime) return null
  try {
    return `data:${mime};base64,${await readFile(join(process.cwd(), 'public', image.src), 'base64')}`
  } catch {
    return null
  }
}

interface CardContent {
  eyebrow: string
  title: string
  subtitle: string
  author: string
  /** A PNG or JPEG data URL framed on the right; without it, the brand's blocks. */
  cover: string | null
}

/**
 * The largest title size whose lines fit the column: Anybody at its expanded width
 * runs about 1em a capital and a little under that for lowercase.
 */
export function fitTitleSize(title: string, width: number, maxHeight: number): number {
  const words = title.split(/\s+/)
  for (let size = 104; size > 36; size -= 4) {
    if (Math.max(...words.map((word) => word.length)) * size * 1.04 > width) continue
    const perLine = Math.floor(width / (size * 0.96))
    let lines = 1
    let used = 0
    for (const word of words) {
      const next = used === 0 ? word.length : used + 1 + word.length
      if (next > perLine) {
        lines += 1
        used = word.length
      } else used = next
    }
    if (lines * size * 1.02 <= maxHeight) return size
  }
  return 36
}

/** A share card over the brand's cobalt: eyebrow, title, subtitle and author, plus a framed screenshot. */
async function renderCard({ author, cover, eyebrow, subtitle, title }: CardContent) {
  // The font is subset to exactly the characters drawn.
  const fontData = await loadDisplayFont(`${eyebrow}${title}${subtitle}${author}`)
  const fontFamily = fontData ? DISPLAY_FONT_NAME : 'sans-serif'
  const columnWidth = cover ? 600 : 860
  const titleSize = fitTitleSize(title, columnWidth - 64 - 32, 290)

  return new ImageResponse(
    <div style={{ background: brandColors.cobalt, display: 'flex', height: '100%', width: '100%' }}>
      <div
        style={{
          color: brandColors.white,
          display: 'flex',
          flexDirection: 'column',
          fontFamily,
          justifyContent: 'space-between',
          padding: 64,
          paddingRight: 32,
          width: columnWidth,
        }}
      >
        <div style={{ color: brandColors.yellow, display: 'flex', fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>
          {eyebrow}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 800, lineHeight: 1 }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, marginTop: 28, opacity: 0.85 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, fontWeight: 800 }}>{author}</div>
      </div>
      {cover ? (
        <div style={{ alignItems: 'center', display: 'flex', flexGrow: 1 }}>
          {/* The frame bleeds off the right edge, with the brand's hard block shadow. */}
          <div
            style={{
              border: `6px solid ${brandColors.white}`,
              boxShadow: `18px 18px 0 ${brandColors.black}`,
              display: 'flex',
              height: 400,
              overflow: 'hidden',
              width: 680,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- the card is drawn by Satori, which takes a plain img */}
            <img
              alt=""
              height={400}
              src={cover}
              style={{ height: '100%', objectFit: 'cover', objectPosition: 'left top', width: '100%' }}
              width={680}
            />
          </div>
        </div>
      ) : (
        <div style={{ background: brandColors.red, display: 'flex', flexGrow: 1 }}>
          <div style={{ background: brandColors.yellow, display: 'flex', height: 210, width: '100%' }} />
        </div>
      )}
    </div>,
    {
      ...ogImageSize,
      fonts: fontData ? [{ data: fontData, name: DISPLAY_FONT_NAME, weight: 800 }] : [],
    },
  )
}

/** A case study's card, with its first landscape screenshot. */
export async function renderProjectOgImage(project: Project, locale: Locale) {
  const cover = project.screenshots.find((image) => image.width > image.height && /\.(?:png|jpe?g)$/i.test(image.src))
  return renderCard({
    eyebrow: translator(locale)('Caso de estudio', 'Case study').toUpperCase(),
    title: project.name,
    subtitle: project.platform,
    author: getPersonalInfo(locale).name,
    cover: cover ? await screenshotData(cover) : null,
  })
}

/** A blog card: an article, or the blog itself when `article` is omitted. */
export async function renderBlogOgImage(locale: Locale, article?: { title: string; subtitle: string }) {
  const t = translator(locale)
  return renderCard({
    eyebrow: 'BLOG',
    title: article?.title ?? t('Notas de lo que construyo', 'Notes on what I build'),
    subtitle: article?.subtitle ?? t('Código, decisiones y lo que aprendí', 'Code, decisions and what I learned'),
    author: getPersonalInfo(locale).name,
    cover: null,
  })
}
