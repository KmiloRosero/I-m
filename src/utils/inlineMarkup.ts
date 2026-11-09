export type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string }

const PATTERN = /`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g

/**
 * Splits article text into plain runs, `code` spans and [links](https://…).
 * Only http(s) and site-relative URLs become links; anything else stays text.
 */
export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let last = 0
  for (const match of text.matchAll(PATTERN)) {
    const index = match.index
    if (index > last) tokens.push({ type: 'text', text: text.slice(last, index) })
    const [, code, label, href] = match
    if (code !== undefined) tokens.push({ type: 'code', text: code })
    else if (label !== undefined && href !== undefined) tokens.push({ type: 'link', text: label, href })
    last = index + match[0].length
  }
  if (last < text.length) tokens.push({ type: 'text', text: text.slice(last) })
  return tokens
}
