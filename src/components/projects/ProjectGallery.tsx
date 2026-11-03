'use client'

import { useState } from 'react'
import { ProjectEntry } from '@/components/projects/ProjectEntry'
import { projectCategoryLabels, projects } from '@/data/projects'
import type { ProjectCategory } from '@/types/project'

const availableCategories = (Object.keys(projectCategoryLabels) as ProjectCategory[]).filter(
  (category) => projects.some((project) => project.category === category),
)

export function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(null)
  const visibleProjects = activeCategory
    ? projects.filter((project) => project.category === activeCategory)
    : projects

  return (
    <>
      <ul aria-label="Filtrar proyectos" className="mt-8 flex flex-wrap gap-2">
        <li>
          <button
            aria-pressed={activeCategory === null}
            className="filter-button"
            onClick={() => setActiveCategory(null)}
            type="button"
          >
            Todos
          </button>
        </li>
        {availableCategories.map((category) => (
          <li key={category}>
            <button
              aria-pressed={activeCategory === category}
              className="filter-button"
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {projectCategoryLabels[category]}
            </button>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="mt-3">
        {visibleProjects.length === 1 ? '1 proyecto' : `${visibleProjects.length} proyectos`}
      </p>
      <div className="project-gallery">
        {visibleProjects.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}
