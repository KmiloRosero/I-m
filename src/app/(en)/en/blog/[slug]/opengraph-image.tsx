import { getArticle, getArticles } from '@/data/blog'
import { formatDate } from '@/utils/formatDate'
import { ogImageSize, renderBlogOgImage } from '@/utils/ogImage'

export const alt = 'An article by Kmilo Rosero'
export const contentType = 'image/png'
export const size = ogImageSize

export function generateStaticParams() {
  return getArticles('en').map(({ slug }) => ({ slug }))
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug, 'en')
  if (!article) return renderBlogOgImage('en')
  const subtitle = formatDate(article.published, 'en')
  return renderBlogOgImage('en', { title: article.title, subtitle })
}
