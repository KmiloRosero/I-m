'use client'

interface ErrorPageProps {
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main
      className="flex min-h-dvh flex-col justify-center gap-6 bg-black px-gutter pt-24 pb-10 text-white"
      id="contenido"
    >
      <div className="mx-auto w-full max-w-content">
        <h1 className="section-title">No se pudo cargar esta página</h1>
        <p className="lead-text mt-6 max-w-text">
          Intenta cargarla de nuevo. Si el problema sigue, vuelve al inicio.
        </p>
        <button className="button-link mt-8" data-variant="primary" onClick={reset} type="button">
          Cargar de nuevo
        </button>
      </div>
    </main>
  )
}
