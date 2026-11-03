interface ServiceImage {
  alt: string
  caption: string
  height: number
  src: string
  width: number
}

export interface ServiceGroup {
  label: string
  items: readonly string[]
}

export type ServiceVisual =
  | { kind: 'screens'; images: readonly ServiceImage[] }
  | { kind: 'routes'; groups: readonly ServiceGroup[] }
  | { kind: 'tables'; groups: readonly ServiceGroup[] }

export interface Service {
  title: string
  description: string
  evidence: readonly string[]
  visual: ServiceVisual
}
