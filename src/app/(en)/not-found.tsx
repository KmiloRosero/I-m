import type { Metadata } from 'next'
import { getMessages } from '@/i18n/messages'
import { NotFoundView } from '@/views/NotFoundView'

export const metadata: Metadata = { title: getMessages('en').notFound.title }

export default function NotFound() {
  return <NotFoundView locale="en" />
}
