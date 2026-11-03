import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Página no encontrada' }

export default function NotFoundPage() {
  return (
    <main
      className="flex min-h-dvh flex-col justify-center gap-6 bg-red px-gutter pt-24 pb-10 text-white"
      id="contenido"
    >
      <div className="mx-auto w-full max-w-content">
        <h1 className="section-title">Esta página no existe</h1>
        <p className="lead-text mt-6 max-w-text">
          El enlace puede estar mal escrito o la página ya no está disponible.
        </p>
        <Link className="button-link mt-8 w-fit" data-variant="primary" href="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
