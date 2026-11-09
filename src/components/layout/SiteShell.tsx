import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Anybody, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import type { Locale } from '@/i18n/config'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import '@/app/globals.css'

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

/** The document for one language: each language has its own root layout, so `<html lang>` is right. */
export function SiteShell({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <html
      className={`${displayFont.variable} ${bodyFont.variable}`}
      data-scroll-behavior="smooth"
      lang={locale}
    >
      <body>
        <LocaleProvider locale={locale}>
          <SiteHeader locale={locale} />
          <div id="page-content">
            {children}
            <SiteFooter locale={locale} />
          </div>
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
