import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { JsonLdScript } from '@/components/seo/JsonLdScript'
import { getArticles, readingMinutes } from '@/data/blog'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { blogPath } from '@/i18n/paths'
import { formatDate } from '@/utils/formatDate'
import { siteUrl } from '@/utils/siteUrl'
import { blogJsonLd } from '@/utils/structuredData'

export function BlogIndexView({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).blog
  const articles = getArticles(locale)

  return (
    <main id="contenido">
      <JsonLdScript
        data={blogJsonLd(
          copy.heading,
          siteUrl,
          blogPath(locale),
          locale,
          articles.map(({ description, published, slug, title }) => ({
            title,
            description,
            published,
            path: blogPath(locale, slug),
          })),
        )}
      />
      <header className="blog-hero">
        <div className="mx-auto max-w-content">
          <p className="blog-eyebrow">{copy.title}</p>
          <h1 className="blog-title">{copy.heading}</h1>
          <p className="lead-text mt-6 max-w-text">{copy.lead}</p>
        </div>
      </header>

      <section aria-label={copy.articles} className="blog-list-section">
        <ol className="blog-list mx-auto max-w-content">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link className="blog-card" href={blogPath(locale, article.slug)}>
                <span className="blog-card-meta">
                  <time dateTime={article.published}>{formatDate(article.published, locale)}</time>
                  <span aria-hidden="true"> · </span>
                  {copy.minutes(readingMinutes(article))}
                </span>
                <span className="blog-card-title">{article.title}</span>
                <span className="blog-card-description">{article.description}</span>
                <span className="blog-card-footer">
                  <span className="blog-tags">
                    {article.tags.map((tag) => (
                      <span className="blog-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                  <ArrowRight aria-hidden="true" className="blog-card-arrow" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
