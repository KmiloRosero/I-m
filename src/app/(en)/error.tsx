'use client'

import { ErrorView } from '@/views/ErrorView'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <ErrorView reset={reset} />
}
