'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { useMessages } from '@/i18n/LocaleProvider'
import type { SkillArea, Technology } from '@/types/skill'

interface Selection {
  category: string
  technology: Technology
}

function firstSelection(area: SkillArea): Selection | null {
  const group = area.groups[0]
  const technology = group?.technologies[0]
  return group && technology ? { category: group.category, technology } : null
}

interface StackExplorerProps {
  areas: readonly SkillArea[]
}

export function StackExplorer({ areas }: StackExplorerProps) {
  const messages = useMessages()
  const copy = messages.stack
  const [areaId, setAreaId] = useState(areas[0]?.id ?? '')
  const [selection, setSelection] = useState(() => (areas[0] ? firstSelection(areas[0]) : null))
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activeIndex = Math.max(
    0,
    areas.findIndex((area) => area.id === areaId),
  )
  const activeArea = areas[activeIndex]
  if (!activeArea) return null

  const selectArea = (index: number) => {
    const area = areas[index]
    if (!area) return
    setAreaId(area.id)
    setSelection(firstSelection(area))
    const tab = tabRefs.current[index]
    tab?.focus({ preventScroll: true })
    // Keep the chosen tab in view when the row scrolls sideways on phones.
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = areas.length - 1
    const next =
      event.key === 'ArrowRight'
        ? activeIndex === last
          ? 0
          : activeIndex + 1
        : event.key === 'ArrowLeft'
          ? activeIndex === 0
            ? last
            : activeIndex - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    selectArea(next)
  }

  const panelId = `stack-panel-${activeArea.id}`

  return (
    <div className="mt-10">
      <div aria-label={copy.areas} className="stack-tabs" role="tablist">
        {areas.map((area, index) => (
          <button
            aria-controls={`stack-panel-${area.id}`}
            aria-selected={area.id === activeArea.id}
            className="stack-tab"
            id={`stack-tab-${area.id}`}
            key={area.id}
            onClick={() => selectArea(index)}
            onKeyDown={onTabKeyDown}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            role="tab"
            tabIndex={area.id === activeArea.id ? 0 : -1}
            type="button"
          >
            {area.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`stack-tab-${activeArea.id}`}
        className="stack-layout"
        id={panelId}
        key={activeArea.id}
        role="tabpanel"
      >
        <div className="stack-area">
          <p className="lead-text max-w-text">{activeArea.intro}</p>
          <div className="stack-groups">
            {activeArea.groups.map(({ category, technologies }, index) => (
              <section aria-labelledby={`stack-category-${activeArea.id}-${index}`} key={category}>
                <h3 className="stack-category" id={`stack-category-${activeArea.id}-${index}`}>
                  {category}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <li key={technology.name}>
                      <button
                        aria-pressed={selection?.technology.name === technology.name}
                        className="choice-button stack-chip"
                        onClick={() => setSelection({ category, technology })}
                        type="button"
                      >
                        {technology.name}
                        {technology.usedIn.length > 0 ? (
                          <span className="stack-chip-count">
                            {technology.usedIn.length}
                            <span className="sr-only">{copy.projectCount}</span>
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {selection ? (
          <aside aria-live="polite" className="stack-panel">
            <div className="stack-panel-body" key={selection.technology.name}>
              <p className="stack-panel-eyebrow">{selection.category}</p>
              <p className="stack-panel-title">{selection.technology.name}</p>
              {selection.technology.summary ? (
                <p className="stack-panel-summary">{selection.technology.summary}</p>
              ) : null}
              {selection.technology.usedIn.length > 0 ? (
                <>
                  <p className="stack-panel-label">{copy.usedIn}</p>
                  <ul className="stack-panel-list">
                    {selection.technology.usedIn.map((project) => {
                      const isExternal = project.href.startsWith('https://')
                      return (
                        <li key={project.href}>
                          {isExternal ? (
                            <a className="stack-panel-link" href={project.href} rel="noreferrer" target="_blank">
                              {project.name}
                              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                              <span className="sr-only">{messages.common.repoInNewTab}</span>
                            </a>
                          ) : (
                            <Link className="stack-panel-link" href={project.href}>
                              {project.name}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
