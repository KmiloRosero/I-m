import { ogImageSize, renderBlogOgImage } from '@/utils/ogImage'

export const alt = 'Blog de Kmilo Rosero'
export const contentType = 'image/png'
export const size = ogImageSize

export default function OpenGraphImage() {
  return renderBlogOgImage('es')
}
