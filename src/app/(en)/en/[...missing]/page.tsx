import { notFound } from 'next/navigation'

/** Any unknown URL under /en renders the English 404 inside the site's layout. */
export default function MissingPage() {
  notFound()
}
