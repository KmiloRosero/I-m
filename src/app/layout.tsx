import type { Metadata, Viewport } from 'next'
import { Anybody, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { brandColors } from '@/data/brandColors'
import { personalInfo } from '@/data/personalInfo'
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

const SITE_TITLE = `${personalInfo.name} | Portafolio`

export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: `%s | ${personalInfo.name}` },
  description: personalInfo.metaDescription,
  openGraph: {
    title: SITE_TITLE,
    description: personalInfo.metaDescription,
    locale: 'es_CO',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: brandColors.black,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${displayFont.variable} ${bodyFont.variable}`}
      data-scroll-behavior="smooth"
      lang="es"
    >
      <body>
        <SiteHeader />
        <div id="page-content">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
