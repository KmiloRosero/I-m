import { ogImageSize, renderBlogOgImage } from '@/utils/ogImage'

export const alt = 'Kmilo Rosero’s blog'
export const contentType = 'image/png'
export const size = ogImageSize

export default function OpenGraphImage() {
  return renderBlogOgImage('en')
}
