import Link from 'next/link'
import type { ReactNode } from 'react'
import type { ArticleBlock } from '@/types/blog'
import { parseInline } from '@/utils/inlineMarkup'

/** Article text with its `code` spans and links as real elements; no HTML is injected. */
function Inline({ text, opensInNewTab }: { text: string; opensInNewTab: string }): ReactNode {
  return parseInline(text).map((token, index) => {
    if (token.type === 'code') return <code key={index}>{token.text}</code>
    if (token.type === 'text') return token.text
    if (token.href.startsWith('/')) {
      return (
        <Link href={token.href} key={index}>
          {token.text}
        </Link>
      )
    }
    return (
      <a href={token.href} key={index} rel="noreferrer" target="_blank">
        {token.text}
        <span className="sr-only">{opensInNewTab}</span>
      </a>
    )
  })
}

export function ArticleBody({ blocks, opensInNewTab }: { blocks: readonly ArticleBlock[]; opensInNewTab: string }) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={index}>{block.text}</h2>
          case 'paragraph':
            return (
              <p key={index}>
                <Inline opensInNewTab={opensInNewTab} text={block.text} />
              </p>
            )
          case 'list':
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>
                    <Inline opensInNewTab={opensInNewTab} text={item} />
                  </li>
                ))}
              </ul>
            )
          case 'code':
            return (
              <figure className="article-code" key={index}>
                <figcaption>{block.language}</figcaption>
                {/* Scrolls sideways on narrow screens, so it must be reachable by keyboard. */}
                <pre tabIndex={0}>
                  <code>{block.code}</code>
                </pre>
              </figure>
            )
        }
      })}
    </div>
  )
}
