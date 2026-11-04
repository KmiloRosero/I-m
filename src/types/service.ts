import type { ProjectRef } from '@/types/skill'

interface ServiceImage {
  alt: string
  caption: string
  height: number
  src: string
  width: number
}

/** A screenshot of a published interface, optionally linking to the live site. */
export interface GalleryImage extends ServiceImage {
  href?: string
}

export interface ServiceGroup {
  label: string
  items: readonly string[]
}

export type ServiceVisual =
  | {
      kind: 'screens'
      images: readonly ServiceImage[]
      /** Card preview shows the phone shot on top of the desktop one. */
      previewPair?: boolean
    }
  | { kind: 'gallery'; images: readonly GalleryImage[] }
  | { kind: 'routes'; groups: readonly ServiceGroup[] }
  | { kind: 'tables'; groups: readonly ServiceGroup[] }

export type ServiceType = 'web' | 'apps' | 'backend' | 'ia'

export interface Service {
  id: string
  type: ServiceType
  title: string
  /** One line for the card. */
  summary: string
  description: string
  /** What the service covers, shown as a list in the detail view. */
  includes: readonly string[]
  tools: readonly string[]
  evidence: readonly ProjectRef[]
  visual: ServiceVisual
}
