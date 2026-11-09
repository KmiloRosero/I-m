import { ogImageSize, renderOgImage } from '@/utils/ogImage'

export const alt = 'Kmilo Rosero’s portfolio'
export const contentType = 'image/png'
export const size = ogImageSize

export default function OpenGraphImage() {
  return renderOgImage('en')
}
