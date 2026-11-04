'use client'

import { ArrowDown, ArrowRight, Code2, Globe } from 'lucide-react'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import type { ExperienceEntry, ExperienceGroup, ExperienceLink } from '@/types/experience'
import { formatKinds } from '@/utils/categoryLabels'

type Filter = ExperienceGroup | 'all'

interface ExperienceTimelineProps {
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

function Entry({ entry }: { entry: ExperienceEntry }) {
  const { description, highlights, kinds, links, period, role, status, technologies, title } = entry

  return (
    <li className="xp-entry" data-group={entry.group}>
      <article className="xp-card">
        <header className="xp-card-meta">
          <span className="xp-kind" data-kind={kinds[0]}>
            {formatKinds(kinds)}
          </span>
          {period ? <span className="xp-period">{period}</span> : null}
        </header>

        <h4 className="xp-title">{title}</h4>
        {role ? <p className="xp-role">{role}</p> : null}
        <p className="xp-description">{description}</p>

        {highlights.length > 0 ? (
          <ul className="xp-highlights">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}

        {technologies.length > 0 ? (
          <ul aria-label="Tecnologías" className="xp-tags">
            {technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        ) : null}

        {status || links.length > 0 ? (
          <footer className="xp-card-footer">
            {status ? (
              <span className="xp-status" data-live={links.some((link) => link.kind === 'demo')}>
                {status}
              </span>
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
          </footer>
        ) : null}
      </article>
    </li>
  )
}

export function ExperienceTimeline({ entries, groups }: ExperienceTimelineProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? entries : entries.filter((entry) => entry.group === filter)
  // Keep the data order: eras appear in the order their first entry does.
  const eras = [...new Set(visible.map((entry) => entry.era))]

  const filters: readonly { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'Todo', count: entries.length },
    ...groups.map(({ id, label }) => ({
      id,
      label,
      count: entries.filter((entry) => entry.group === id).length,
    })),
  ]

  return (
    <>
      <div aria-label="Filtrar experiencia" className="xp-filters" role="group">
        {filters.map(({ id, label, count }) => (
          <button
            aria-pressed={filter === id}
            className="xp-filter"
            key={id}
            onClick={() => setFilter(id)}
            type="button"
          >
            {label}
            <span className="xp-filter-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="xp-timeline" key={filter}>
        {eras.map((era) => (
          <section aria-labelledby={`xp-era-${era}`} className="xp-era" key={era}>
            <h3 className="xp-era-label" id={`xp-era-${era}`}>
              {era}
            </h3>
            <ol className="xp-list">
              {visible
                .filter((entry) => entry.era === era)
                .map((entry) => (
                  <Entry entry={entry} key={entry.id} />
                ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  )
}
