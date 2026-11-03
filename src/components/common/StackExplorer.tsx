'use client'

import { useState } from 'react'
import type { SkillGroup, Technology } from '@/types/skill'

interface StackExplorerProps {
  groups: readonly SkillGroup[]
  initialTechnology: Technology
}

export function StackExplorer({ groups, initialTechnology }: StackExplorerProps) {
  const [selected, setSelected] = useState(initialTechnology)

  return (
    <div className="stack-layout">
      <div className="stack-groups">
        {groups.map(({ category, technologies }, index) => (
          <section aria-labelledby={`stack-category-${index}`} key={category}>
            <h3 className="stack-category" id={`stack-category-${index}`}>
              {category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <li key={technology.name}>
                  <button
                    aria-pressed={selected.name === technology.name}
                    className="choice-button"
                    onClick={() => setSelected(technology)}
                    type="button"
                  >
                    {technology.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <aside aria-live="polite" className="stack-panel">
        <p className="stack-panel-title">{selected.name}</p>
        <p className="mt-4">Aparece en:</p>
        <ul className="mt-1">
          {selected.usedIn.map((project) => (
            <li className="lead-text" key={project}>
              {project}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
