import { ImageResponse } from 'next/og'
import { brandColors } from '@/data/brandColors'
import { personalInfo } from '@/data/personalInfo'

const DISPLAY_FONT_NAME = 'Anybody'
const DISPLAY_FONT_CSS_URL = 'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@150,800'
const FONT_FILE_PATTERN = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/

export const alt = `Portafolio de ${personalInfo.name}`
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

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

export default async function OpenGraphImage() {
  const { firstName, lastName, position, studies } = personalInfo
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
      ...size,
      fonts: fontData ? [{ data: fontData, name: DISPLAY_FONT_NAME, weight: 800 }] : [],
    },
  )
}
