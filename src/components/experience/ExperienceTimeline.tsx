'use client'

import { ArrowDown, ArrowLeft, ArrowRight, Code2, Globe } from 'lucide-react'
import Link from 'next/link'
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useDragScroll } from '@/hooks/useDragScroll'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ExperienceEntry, ExperienceGroup, ExperienceLink } from '@/types/experience'
import { formatKinds } from '@/utils/categoryLabels'

type Filter = ExperienceGroup | 'all'

interface ExperienceTimelineProps {
  /** Entries newest first, as written in the data file. */
  entries: readonly ExperienceEntry[]
  groups: readonly { id: ExperienceGroup; label: string }[]
}

/** Accumulated wheel delta that moves the rail one stop. */
const WHEEL_STEP = 40
/** Minimum time between wheel steps, so one flick doesn't skip several stops. */
const WHEEL_COOLDOWN_MS = 320

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
  // The rail and the cards read left to right, oldest to newest.
  const chronological = [...entries].reverse()
  const [filter, setFilter] = useState<Filter>('all')
  const [activeId, setActiveId] = useState(chronological.at(-1)?.id ?? '')
  const reducedMotion = usePrefersReducedMotion()

  const railRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stopRefs = useRef(new Map<string, HTMLButtonElement>())
  const cardRefs = useRef(new Map<string, HTMLElement>())
  /** Index the track is scrolling to; scroll sync waits until it arrives. */
  const targetRef = useRef<number | null>(null)

  const visible = filter === 'all' ? chronological : chronological.filter((entry) => entry.group === filter)
  const activeIndex = Math.max(
    0,
    visible.findIndex((entry) => entry.id === activeId),
  )
  const active = visible[activeIndex]

  const scrollToCard = (index: number, behavior: ScrollBehavior) => {
    const track = trackRef.current
    const entry = visible[index]
    const card = entry ? cardRefs.current.get(entry.id) : undefined
    if (!track || !card) return
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2
    targetRef.current = behavior === 'smooth' ? index : null
    track.scrollTo({ left, behavior })
  }

  const select = (index: number) => {
    const entry = visible[index]
    if (!entry) return
    setActiveId(entry.id)
    scrollToCard(index, reducedMotion ? 'auto' : 'smooth')
  }

  const nearestCardIndex = () => {
    const track = trackRef.current
    if (!track) return -1
    const center = track.scrollLeft + track.clientWidth / 2
    let best = -1
    let bestDistance = Number.POSITIVE_INFINITY
    visible.forEach((entry, index) => {
      const card = cardRefs.current.get(entry.id)
      if (!card) return
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    return best
  }

  // After a mouse drag, settle on the nearest card.
  useDragScroll(trackRef, () => {
    const index = nearestCardIndex()
    if (index >= 0) select(index)
  })
  useDragScroll(railRef)

  // Effect events always see the current render's state from native listeners.
  const syncFromScroll = useEffectEvent((finished: boolean) => {
    const index = nearestCardIndex()
    if (index < 0) return
    if (finished) targetRef.current = null
    if (targetRef.current !== null) {
      if (index !== targetRef.current) return
      targetRef.current = null
    }
    const entry = visible[index]
    if (entry && entry.id !== activeId) setActiveId(entry.id)
  })

  // Swiping or trackpad-scrolling the cards updates the rail.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        syncFromScroll(false)
      })
    }
    const onScrollEnd = () => syncFromScroll(true)

    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('scrollend', onScrollEnd)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('scrollend', onScrollEnd)
    }
  }, [])

  /** Returns true when the wheel moved the rail, so the page should not scroll. */
  const stepFromWheel = useEffectEvent((direction: 1 | -1, shouldStep: boolean) => {
    const atEdge = (direction < 0 && activeIndex === 0) || (direction > 0 && activeIndex === visible.length - 1)
    if (atEdge) return false
    if (shouldStep) select(activeIndex + direction)
    return true
  })

  // The mouse wheel over the rail steps through stops. At either end it
  // lets the page scroll on, so the reader is never trapped here.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let accumulated = 0
    let lastStep = 0

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      const direction = event.deltaY > 0 ? 1 : -1
      accumulated += event.deltaY
      const now = performance.now()
      const shouldStep = Math.abs(accumulated) >= WHEEL_STEP && now - lastStep >= WHEEL_COOLDOWN_MS
      if (!stepFromWheel(direction, shouldStep)) {
        accumulated = 0
        return
      }
      event.preventDefault()
      if (shouldStep) {
        accumulated = 0
        lastStep = now
      }
    }

    rail.addEventListener('wheel', onWheel, { passive: false })
    return () => rail.removeEventListener('wheel', onWheel)
  }, [])

  // Start on the newest card, and jump there again when the filter changes.
  const jumpToActive = useEffectEvent(() => scrollToCard(activeIndex, 'auto'))
  useLayoutEffect(() => {
    jumpToActive()
  }, [filter])

  // Keep the active stop centred in the rail without scrolling the page.
  useEffect(() => {
    const rail = railRef.current
    const stop = active ? stopRefs.current.get(active.id) : undefined
    if (!rail || !stop) return
    const left = stop.offsetLeft - rail.clientWidth / 2 + stop.clientWidth / 2
    rail.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [active, reducedMotion])

  if (!active) return null

  const onStopKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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
    select(next)
    const entry = visible[next]
    if (entry) stopRefs.current.get(entry.id)?.focus({ preventScroll: true })
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

  // Era segments for the band above the rail: consecutive entries share a label.
  const eras = visible.reduce<{ label: string; span: number }[]>((segments, entry) => {
    const last = segments.at(-1)
    if (last && last.label === entry.era) last.span += 1
    else segments.push({ label: entry.era, span: 1 })
    return segments
  }, [])

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

          <div aria-label="Línea de tiempo" className="xp-stops" role="group">
            <span aria-hidden="true" className="xp-track">
              <span className="xp-track-fill" />
            </span>
            {visible.map((entry, index) => {
              const isActive = entry.id === active.id
              return (
                <button
                  aria-controls={`xp-card-${entry.id}`}
                  aria-current={isActive ? 'step' : undefined}
                  className="xp-stop"
                  data-active={isActive}
                  data-group={entry.group}
                  data-passed={index <= activeIndex}
                  key={entry.id}
                  onClick={() => select(index)}
                  onKeyDown={onStopKeyDown}
                  ref={(element) => {
                    if (element) stopRefs.current.set(entry.id, element)
                    else stopRefs.current.delete(entry.id)
                  }}
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

      <p className="xp-hint">
        Desliza las tarjetas, arrástralas con el mouse o gira la rueda sobre la línea de tiempo.
      </p>

      <div
        aria-label="Experiencia"
        aria-roledescription="carrusel"
        className="xp-cards"
        ref={trackRef}
        role="region"
      >
        {visible.map((entry, index) => (
          // A carousel slide is a group (ARIA APG); <article> may not take that role.
          <div
            aria-label={`${index + 1} de ${visible.length}: ${entry.title}`}
            aria-roledescription="diapositiva"
            className="xp-card"
            data-active={entry.id === active.id}
            id={`xp-card-${entry.id}`}
            key={entry.id}
            ref={(element) => {
              if (element) cardRefs.current.set(entry.id, element)
              else cardRefs.current.delete(entry.id)
            }}
            role="group"
          >
            <div className="xp-detail-body">
              <EntryDetail entry={entry} />
            </div>
          </div>
        ))}
      </div>

      <nav aria-label="Recorrer la experiencia" className="xp-stepper">
        <button className="xp-step" disabled={!previous} onClick={() => select(activeIndex - 1)} type="button">
          <ArrowLeft aria-hidden="true" className="size-5" />
          <span>
            <span className="xp-step-hint">Anterior</span>
            {previous ? <span className="xp-step-name">{previous.railLabel ?? previous.title}</span> : null}
          </span>
        </button>
        <p aria-live="polite" className="xp-step-count">
          {activeIndex + 1} / {visible.length}
        </p>
        <button
          className="xp-step"
          data-side="next"
          disabled={!next}
          onClick={() => select(activeIndex + 1)}
          type="button"
        >
          <span>
            <span className="xp-step-hint">Siguiente</span>
            {next ? <span className="xp-step-name">{next.railLabel ?? next.title}</span> : null}
          </span>
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </nav>
    </div>
  )
}
