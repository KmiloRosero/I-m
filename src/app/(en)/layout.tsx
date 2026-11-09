import type { ReactNode } from 'react'
import { SiteShell } from '@/components/layout/SiteShell'
import { siteMetadata, siteViewport } from '@/utils/siteMetadata'

export const metadata = siteMetadata('en')
export const viewport = siteViewport

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>
}
