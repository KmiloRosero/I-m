import type { MetadataRoute } from 'next'
import { siteUrl } from '@/utils/siteUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/', userAgent: '*' },
    sitemap: new URL('/sitemap.xml', siteUrl).href,
  }
}
