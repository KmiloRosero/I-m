import { ImageResponse } from 'next/og'
import { personalInfo } from '@/data/personalInfo'

export const alt = `Portafolio de ${personalInfo.name}`
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: '#1433d6', display: 'flex', height: '100%', width: '100%' }}>
      <div
        style={{
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 64,
          width: 860,
        }}
      >
        <div style={{ display: 'flex', fontSize: 132, fontWeight: 700, lineHeight: 1 }}>Camilo</div>
        <div style={{ display: 'flex', fontSize: 132, fontWeight: 700, lineHeight: 1 }}>Rosero</div>
        <div style={{ display: 'flex', fontSize: 36, marginTop: 32 }}>{personalInfo.studies}</div>
        <div style={{ display: 'flex', fontSize: 36 }}>{personalInfo.position}</div>
      </div>
      <div style={{ background: '#d81e1e', display: 'flex', flexGrow: 1 }}>
        <div style={{ background: '#ffd100', display: 'flex', height: 210, width: '100%' }} />
      </div>
    </div>,
    size,
  )
}
