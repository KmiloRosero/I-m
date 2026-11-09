/**
 * One piece of an article. Text may use `code` and [links](https://…);
 * the renderer turns those into elements, so no HTML is ever injected.
 */
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'code'; language: string; code: string }

export interface Article {
  slug: string
  title: string
  description: string
  /** ISO date, YYYY-MM-DD. */
  published: string
  tags: readonly string[]
  blocks: readonly ArticleBlock[]
}
