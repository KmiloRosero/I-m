import type { ReactNode } from 'react'
import { SiteShell } from '@/components/layout/SiteShell'
import { siteMetadata, siteViewport } from '@/utils/siteMetadata'

export const metadata = siteMetadata('es')
export const viewport = siteViewport

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="es">{children}</SiteShell>
}
