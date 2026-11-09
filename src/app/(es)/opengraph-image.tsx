import { ogImageSize, renderOgImage } from '@/utils/ogImage'

export const alt = 'Portafolio de Kmilo Rosero'
export const contentType = 'image/png'
export const size = ogImageSize

export default function OpenGraphImage() {
  return renderOgImage('es')
}
