import { notFound } from 'next/navigation'

/** Any unknown Spanish URL renders the Spanish 404 inside the site's layout. */
export default function MissingPage() {
  notFound()
}
