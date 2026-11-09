import type { Metadata } from 'next'
import { getMessages } from '@/i18n/messages'
import { NotFoundView } from '@/views/NotFoundView'

export const metadata: Metadata = { title: getMessages('es').notFound.title }

export default function NotFound() {
  return <NotFoundView locale="es" />
}
