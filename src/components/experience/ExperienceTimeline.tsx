'use client'

import { ArrowDown, ArrowLeft, ArrowRight, Code2, Globe } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ExperienceEntry, ExperienceGroup, ExperienceLink } from '@/types/experience'
import { formatKinds } from '@/utils/categoryLabels'

type Filter = ExperienceGroup | 'all'

interface ExperienceTimelineProps {
  /** Entries newest first, as written in the data file. */
  entries: readonly ExperienceEntry[]
  groups: readonly { id: ExperienceGroup; label: string }[]
}

const linkIcons: Record<ExperienceLink['kind'], ReactNode> = {
  'case-study': <ArrowRight aria-hidden="true" className="size-4" />,
  demo: <Globe aria-hidden="true" className="size-4" />,
  repo: <Code2 aria-hidden="true" className="size-4" />,
  section: <ArrowDown aria-hidden="true" className="size-4" />,
}

function EntryLink({ link, context }: { link: ExperienceLink; context: string }) {
  const content = (
    <>
      {linkIcons[link.kind]}
      {link.label}
      <span className="sr-only"> de {context}</span>
    </>
  )

  if (link.href.startsWith('https://')) {
    return (
      <a className="xp-link" data-kind={link.kind} href={link.href} rel="noreferrer" target="_blank">
        {content}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    )
  }
  return (
    <Link className="xp-link" data-kind={link.kind} href={link.href}>
      {content}
    </Link>
  )
}

function EntryDetail({ entry }: { entry: ExperienceEntry }) {
  const { description, highlights, kinds, links, period, role, status, technologies, title } = entry
  const isLive = links.some((link) => link.kind === 'demo')

  return (
    <>
      <div className="xp-detail-main">
        <p className="xp-detail-meta">
          <span className="xp-kind" data-kind={kinds[0]}>
            {formatKinds(kinds)}
          </span>
          {period ? <span className="xp-period">{period}</span> : null}
        </p>
        <h3 className="xp-detail-title">{title}</h3>
        {role ? <p className="xp-role">{role}</p> : null}
        <p className="xp-description">{description}</p>
        {status ? (
          <p className="xp-status" data-live={isLive}>
            {status}
          </p>
        ) : null}
        {links.length > 0 ? (
          <ul className="xp-links">
            {links.map((link) => (
              <li key={link.href}>
                <EntryLink context={title} link={link} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {highlights.length > 0 || technologies.length > 0 ? (
        <div className="xp-detail-aside">
          {highlights.length > 0 ? (
            <div>
              <p className="xp-label">Lo más importante</p>
              <ul className="xp-highlights">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {technologies.length > 0 ? (
            <div>
              <p className="xp-label">Tecnologías</p>
              <ul className="xp-tags">
                {technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

export function ExperienceTimeline({ entries, groups }: ExperienceTimelineProps) {
  // The rail reads left to right, oldest to newest.
  const chronological = [...entries].reverse()
  const [filter, setFilter] = useState<Filter>('all')
  const [activeId, setActiveId] = useState(chronological.at(-1)?.id ?? '')
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const railRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const reducedMotion = usePrefersReducedMotion()

  const visible = filter === 'all' ? chronological : chronological.filter((entry) => entry.group === filter)
  const activeIndex = Math.max(
    0,
    visible.findIndex((entry) => entry.id === activeId),
  )
  const active = visible[activeIndex]

  // Era segments for the band above the rail: consecutive entries share a label.
  const eras = visible.reduce<{ label: string; span: number }[]>((segments, entry) => {
    const last = segments.at(-1)
    if (last && last.label === entry.era) last.span += 1
    else segments.push({ label: entry.era, span: 1 })
    return segments
  }, [])

  // Keep the active stop in view inside the rail without scrolling the page.
  useEffect(() => {
    const rail = railRef.current
    const tab = active ? tabRefs.current.get(active.id) : undefined
    if (!rail || !tab) return
    const left = tab.offsetLeft - rail.clientWidth / 2 + tab.clientWidth / 2
    rail.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [active, reducedMotion])

  if (!active) return null

  const select = (index: number, focus = false) => {
    const entry = visible[index]
    if (!entry) return
    setDirection(index >= activeIndex ? 'forward' : 'back')
    setActiveId(entry.id)
    if (focus) tabRefs.current.get(entry.id)?.focus({ preventScroll: true })
  }

  const onRailKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = visible.length - 1
    const keys: Record<string, number> = {
      ArrowRight: Math.min(activeIndex + 1, last),
      ArrowLeft: Math.max(activeIndex - 1, 0),
      Home: 0,
      End: last,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  const changeFilter = (next: Filter) => {
    setFilter(next)
    const pool = next === 'all' ? chronological : chronological.filter((entry) => entry.group === next)
    if (!pool.some((entry) => entry.id === activeId)) setActiveId(pool.at(-1)?.id ?? '')
  }

  const filters: readonly { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'Todo', count: chronological.length },
    ...groups.map(({ id, label }) => ({
      id,
      label,
      count: chronological.filter((entry) => entry.group === id).length,
    })),
  ]

  const railStyle = {
    '--xp-stops': visible.length,
    '--xp-progress': visible.length > 1 ? activeIndex / (visible.length - 1) : 1,
  } as CSSProperties
  const previous = visible[activeIndex - 1]
  const next = visible[activeIndex + 1]

  return (
    <div className="xp">
      <div aria-label="Filtrar experiencia" className="xp-filters" role="group">
        {filters.map(({ id, label, count }) => (
          <button
            aria-pressed={filter === id}
            className="xp-filter"
            key={id}
            onClick={() => changeFilter(id)}
            type="button"
          >
            {label}
            <span className="xp-filter-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="xp-rail-scroller" ref={railRef}>
        <div className="xp-rail" key={filter} style={railStyle}>
          <ol aria-hidden="true" className="xp-eras">
            {eras.map(({ label, span }, index) => (
              <li key={`${label}-${index}`} style={{ gridColumn: `span ${span}` }}>
                <span>{label}</span>
              </li>
            ))}
          </ol>

          <div aria-label="Línea de tiempo" aria-orientation="horizontal" className="xp-stops" role="tablist">
            <span aria-hidden="true" className="xp-track">
              <span className="xp-track-fill" />
            </span>
            {visible.map((entry, index) => {
              const isActive = entry.id === active.id
              return (
                <button
                  aria-controls="xp-detail"
                  aria-selected={isActive}
                  className="xp-stop"
                  data-group={entry.group}
                  data-passed={index <= activeIndex}
                  id={`xp-stop-${entry.id}`}
                  key={entry.id}
                  onClick={() => select(index)}
                  onKeyDown={onRailKeyDown}
                  ref={(element) => {
                    if (element) tabRefs.current.set(entry.id, element)
                    else tabRefs.current.delete(entry.id)
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <span className="xp-stop-date">{entry.period ?? entry.status ?? entry.era}</span>
                  <span aria-hidden="true" className="xp-stop-dot" />
                  <span className="xp-stop-label">{entry.railLabel ?? entry.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div aria-labelledby={`xp-stop-${active.id}`} className="xp-detail" id="xp-detail" role="tabpanel">
        <div className="xp-detail-body" data-direction={direction} key={active.id}>
          <EntryDetail entry={active} />
        </div>

        <nav aria-label="Recorrer la línea de tiempo" className="xp-stepper">
          <button
            className="xp-step"
            disabled={!previous}
            onClick={() => select(activeIndex - 1)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            <span>
              <span className="xp-step-hint">Anterior</span>
              {previous ? <span className="xp-step-name">{previous.railLabel ?? previous.title}</span> : null}
            </span>
          </button>
          <p aria-live="polite" className="xp-step-count">
            {activeIndex + 1} / {visible.length}
          </p>
          <button className="xp-step" data-side="next" disabled={!next} onClick={() => select(activeIndex + 1)} type="button">
            <span>
              <span className="xp-step-hint">Siguiente</span>
              {next ? <span className="xp-step-name">{next.railLabel ?? next.title}</span> : null}
            </span>
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        </nav>
      </div>
    </div>
  )
}
