import { getArticle, getArticles } from '@/data/blog'
import { formatDate } from '@/utils/formatDate'
import { ogImageSize, renderBlogOgImage } from '@/utils/ogImage'

export const alt = 'Artículo de Kmilo Rosero'
export const contentType = 'image/png'
export const size = ogImageSize

export function generateStaticParams() {
  return getArticles('es').map(({ slug }) => ({ slug }))
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug, 'es')
  if (!article) return renderBlogOgImage('es')
  const subtitle = formatDate(article.published, 'es')
  return renderBlogOgImage('es', { title: article.title, subtitle })
}
