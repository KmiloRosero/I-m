import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { JsonLdScript } from '@/components/seo/JsonLdScript'
import { getArticles, readingMinutes } from '@/data/blog'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { blogPath, homePath, sectionHref } from '@/i18n/paths'
import type { Article } from '@/types/blog'
import { formatDate } from '@/utils/formatDate'
import { siteUrl } from '@/utils/siteUrl'
import { articleJsonLd } from '@/utils/structuredData'

export function ArticleView({ article, locale }: { article: Article; locale: Locale }) {
  const messages = getMessages(locale)
  const copy = messages.blog
  const articles = getArticles(locale)
  const next = articles[(articles.findIndex(({ slug }) => slug === article.slug) + 1) % articles.length]
  const path = blogPath(locale, article.slug)
  const structuredData = articleJsonLd(article, siteUrl, path, locale, [
    { name: messages.sections.home, path: homePath(locale) },
    { name: copy.title, path: blogPath(locale) },
    { name: article.title, path },
  ])

  return (
    <main id="contenido">
      <JsonLdScript data={structuredData} />
      <article>
        <header className="article-hero">
          <div className="article-column">
            <Link className="article-back" href={blogPath(locale)}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              {copy.back}
            </Link>
            <p className="blog-card-meta mt-10">
              <time dateTime={article.published}>{formatDate(article.published, locale)}</time>
              <span aria-hidden="true"> · </span>
              {copy.minutes(readingMinutes(article))}
            </p>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-lead">{article.description}</p>
            <ul aria-label={copy.tags} className="blog-tags mt-6">
              {article.tags.map((tag) => (
                <li className="blog-tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="article-main">
          <div className="article-column">
            <ArticleBody blocks={article.blocks} opensInNewTab={messages.common.opensInNewTab} />
            <p className="article-contact">
              {copy.contact}{' '}
              <Link className="text-link" href={sectionHref('contact', locale)}>
                {copy.contactLink}
              </Link>
            </p>
          </div>
        </div>
      </article>

      {next && next.slug !== article.slug ? (
        <nav aria-label={copy.next} className="bg-yellow px-gutter py-12 text-black">
          <div className="mx-auto max-w-content">
            <p>{copy.next}</p>
            <Link className="article-next text-link" href={blogPath(locale, next.slug)}>
              {next.title}
            </Link>
          </div>
        </nav>
      ) : null}
    </main>
  )
}
