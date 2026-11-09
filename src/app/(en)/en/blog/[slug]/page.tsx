import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getArticles } from '@/data/blog'
import { articleMetadata } from '@/utils/siteMetadata'
import { ArticleView } from '@/views/ArticleView'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getArticles('en').map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticle((await params).slug, 'en')
  return article ? articleMetadata(article, 'en') : {}
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticle((await params).slug, 'en')
  if (!article) notFound()
  return <ArticleView article={article} locale="en" />
}
