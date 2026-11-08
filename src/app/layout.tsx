import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Anybody, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { brandColors } from '@/data/brandColors'
import { personalInfo } from '@/data/personalInfo'
import { siteUrl } from '@/utils/siteUrl'
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
  metadataBase: siteUrl,
  title: { default: personalInfo.seoTitle, template: `%s | ${personalInfo.name}` },
  description: personalInfo.metaDescription,
  applicationName: personalInfo.name,
  authors: [{ name: personalInfo.name, url: siteUrl }],
  creator: personalInfo.name,
  openGraph: {
    title: personalInfo.seoTitle,
    description: personalInfo.metaDescription,
    locale: 'es_CO',
    siteName: personalInfo.name,
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: personalInfo.seoTitle,
    description: personalInfo.metaDescription,
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
