import { serializeJsonLd, type JsonLd } from '@/utils/structuredData'

/** Structured data for search engines; a plain script tag, since it is data, not code. */
export function JsonLdScript({ data }: { data: JsonLd }) {
  return <script dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} type="application/ld+json" />
}
