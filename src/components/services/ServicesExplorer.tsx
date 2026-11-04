'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { ServiceVisual } from '@/components/services/ServiceVisual'
import type { Service, ServiceType } from '@/types/service'

type Filter = ServiceType | 'all'

type StaggerStyle = CSSProperties & Record<'--stagger-index', number>

/** Caps the stagger so a long list never waits on its last card. */
const MAX_STAGGER = 6

interface ServicesExplorerProps {
  services: readonly Service[]
  types: readonly { id: ServiceType; label: string }[]
}

function ServicePreview({ service }: { service: Service }) {
  const { visual } = service
  if (visual.kind === 'screens') {
    const isPortrait = (image: { height: number; width: number }) => image.height > image.width
    const landscape = visual.images.find((image) => !isPortrait(image))
    const portrait = visual.images.find(isPortrait)
    const main = landscape ?? portrait
    if (!main) return null
    return (
      <>
        <Image
          alt=""
          className="service-card-image"
          data-orientation={isPortrait(main) ? 'portrait' : 'landscape'}
          height={main.height}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
          src={main.src}
          width={main.width}
        />
        {/* Desktop plus phone: show the phone on top, like a responsive preview. */}
        {visual.previewPair && landscape && portrait ? (
          <Image
            alt=""
            className="service-card-phone"
            height={portrait.height}
            sizes="8rem"
            src={portrait.src}
            width={portrait.width}
          />
        ) : null}
      </>
    )
  }

  const items = visual.groups.flatMap((group) => group.items).slice(0, 4)
  return (
    <ul className="service-card-code" data-variant={visual.kind}>
      {items.map((item) => (
        <li key={item}>
          <code>{item}</code>
        </li>
      ))}
    </ul>
  )
}

function EvidenceLink({ name, href }: { name: string; href: string }) {
  if (href.startsWith('https://')) {
    return (
      <a className="service-chip" href={href} rel="noreferrer" target="_blank">
        {name}
        <ArrowUpRight aria-hidden="true" className="size-4" />
        <span className="sr-only"> (repositorio en GitHub, se abre en una pestaña nueva)</span>
      </a>
    )
  }
  return (
    <Link className="service-chip" href={href}>
      {name}
    </Link>
  )
}

export function ServicesExplorer({ services, types }: ServicesExplorerProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const typeLabel = (type: ServiceType) => types.find((candidate) => candidate.id === type)?.label ?? ''
  const visible = filter === 'all' ? services : services.filter((service) => service.type === filter)
  const openIndex = visible.findIndex((service) => service.id === openId)
  const openService = openIndex >= 0 ? visible[openIndex] : undefined

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (openService && !dialog.open) dialog.showModal()
    if (!openService && dialog.open) dialog.close()
  }, [openService])

  const step = (direction: 1 | -1) => {
    const next = visible[(openIndex + direction + visible.length) % visible.length]
    if (next) setOpenId(next.id)
  }

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) event.currentTarget.close()
  }

  const filters: readonly { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: services.length },
    ...types.map(({ id, label }) => ({
      id,
      label,
      count: services.filter((service) => service.type === id).length,
    })),
  ]

  return (
    <>
      <div aria-label="Filtrar servicios por tipo" className="service-filters" role="group">
        {filters.map(({ id, label, count }) => (
          <button
            aria-pressed={filter === id}
            className="service-filter"
            key={id}
            onClick={() => setFilter(id)}
            type="button"
          >
            {label}
            <span className="service-filter-count">{count}</span>
          </button>
        ))}
      </div>

      <ul className="service-grid" key={filter}>
        {visible.map((service, index) => (
          <li
            className="service-card-item"
            key={service.id}
            style={{ '--stagger-index': Math.min(index, MAX_STAGGER) } as StaggerStyle}
          >
            <button
              aria-haspopup="dialog"
              className="service-card"
              onClick={() => setOpenId(service.id)}
              type="button"
            >
              <span className="service-card-preview" data-kind={service.visual.kind}>
                <ServicePreview service={service} />
              </span>
              <span className="service-card-body">
                <span className="service-card-meta">
                  <span>{typeLabel(service.type)}</span>
                  <span aria-hidden="true">{String(services.indexOf(service) + 1).padStart(2, '0')}</span>
                </span>
                <span className="service-card-title">{service.title}</span>
                <span className="service-card-summary">{service.summary}</span>
                <span className="service-card-cta">
                  Ver servicio
                  <ArrowRight aria-hidden="true" className="service-card-arrow" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        aria-labelledby={openService ? 'service-dialog-title' : undefined}
        className="service-dialog"
        onClick={closeOnBackdrop}
        onClose={() => setOpenId(null)}
        ref={dialogRef}
      >
        {openService ? (
          <div className="service-dialog-frame">
            <header className="service-dialog-header">
              <p className="service-dialog-eyebrow">
                {typeLabel(openService.type)}
                <span aria-hidden="true"> · </span>
                {openIndex + 1} de {visible.length}
              </p>
              <div className="flex gap-2">
                {visible.length > 1 ? (
                  <>
                    <button aria-label="Servicio anterior" className="service-dialog-button" onClick={() => step(-1)} type="button">
                      <ArrowLeft aria-hidden="true" />
                    </button>
                    <button aria-label="Servicio siguiente" className="service-dialog-button" onClick={() => step(1)} type="button">
                      <ArrowRight aria-hidden="true" />
                    </button>
                  </>
                ) : null}
                <button
                  aria-label="Cerrar"
                  className="service-dialog-button"
                  onClick={() => dialogRef.current?.close()}
                  type="button"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
            </header>

            <div className="service-dialog-body" key={openService.id}>
              <div className="service-dialog-copy">
                <h3 className="service-dialog-title" id="service-dialog-title">
                  {openService.title}
                </h3>
                <p className="service-dialog-description">{openService.description}</p>

                <div>
                  <p className="service-dialog-label">Qué incluye</p>
                  <ul className="service-includes">
                    {openService.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="service-dialog-label">Herramientas</p>
                  <ul className="service-tools">
                    {openService.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="service-dialog-label">Lo he hecho en</p>
                  <ul className="service-evidence">
                    {openService.evidence.map((project) => (
                      <li key={project.href}>
                        <EvidenceLink {...project} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="service-dialog-visual">
                <ServiceVisual visual={openService.visual} />
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  )
}
