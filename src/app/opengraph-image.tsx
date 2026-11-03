import { ImageResponse } from 'next/og'
import { brandColors } from '@/data/brandColors'
import { personalInfo } from '@/data/personalInfo'

export const alt = `Portafolio de ${personalInfo.name}`
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: brandColors.cobalt, display: 'flex', height: '100%', width: '100%' }}>
      <div
        style={{
          color: brandColors.white,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 64,
          width: 860,
        }}
      >
        <div style={{ display: 'flex', fontSize: 132, fontWeight: 700, lineHeight: 1 }}>{personalInfo.firstName}</div>
        <div style={{ display: 'flex', fontSize: 132, fontWeight: 700, lineHeight: 1 }}>{personalInfo.lastName}</div>
        <div style={{ display: 'flex', fontSize: 36, marginTop: 32 }}>{personalInfo.studies}</div>
        <div style={{ display: 'flex', fontSize: 36 }}>{personalInfo.position}</div>
      </div>
      <div style={{ background: brandColors.red, display: 'flex', flexGrow: 1 }}>
        <div style={{ background: brandColors.yellow, display: 'flex', height: 210, width: '100%' }} />
      </div>
    </div>,
    size,
  )
}
