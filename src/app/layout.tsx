import type { Metadata, Viewport } from 'next'
import { Anybody, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'

const displayFont = Anybody({
  axes: ['wdth'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-anybody',
})

const bodyFont = Newsreader({
  axes: ['opsz'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  title: 'Camilo Rosero | Portafolio',
  description:
    'Portafolio de Camilo Rosero, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia, Pasto.',
  openGraph: {
    title: 'Camilo Rosero | Portafolio',
    description:
      'Portafolio de Camilo Rosero, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia, Pasto.',
    locale: 'es_CO',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${displayFont.variable} ${bodyFont.variable}`}
      data-scroll-behavior="smooth"
      lang="es"
    >
      <body>{children}</body>
    </html>
  )
}
