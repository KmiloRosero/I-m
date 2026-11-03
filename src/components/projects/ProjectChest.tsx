'use client'

import { useState, type CSSProperties } from 'react'
import { ProjectDialog } from '@/components/projects/ProjectDialog'
import { projects } from '@/data/projects'

type CubeStyle = CSSProperties & Record<`--cube-${string}`, number | string>

const CUBES_ID = 'project-cubes'
const centerIndex = (projects.length - 1) / 2

function getCubeStyle(index: number, face: string, top: string): CubeStyle {
  const offset = index - centerIndex
  return {
    '--cube-arc': centerIndex - Math.abs(offset),
    '--cube-face': face,
    '--cube-index': index,
    '--cube-offset': offset,
    '--cube-top': top,
  }
}

export function ProjectChest() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const selectedProject = projects.find(({ slug }) => slug === selectedSlug) ?? null

  return (
    <div className="mt-10">
      <div className="chest-scene" data-open={isOpen}>
        <button
          aria-controls={CUBES_ID}
          aria-expanded={isOpen}
          className="chest-button"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span className="sr-only">{isOpen ? 'Cerrar el cofre' : 'Abrir el cofre de proyectos'}</span>
          <span aria-hidden="true" className="chest-object">
            <span className="chest-body">
              <span className="chest-face" data-side="front" />
              <span className="chest-face" data-side="back" />
              <span className="chest-face" data-side="left" />
              <span className="chest-face" data-side="right" />
              <span className="chest-face" data-side="hollow" />
              <span className="chest-latch" />
            </span>
            <span className="chest-lid">
              <span className="chest-face" data-side="lid-front" />
              <span className="chest-face" data-side="lid-back" />
              <span className="chest-face" data-side="lid-left" />
              <span className="chest-face" data-side="lid-right" />
              <span className="chest-face" data-side="lid-top" />
            </span>
          </span>
        </button>

        <ul aria-label="Proyectos del cofre" className="chest-cubes" id={CUBES_ID} inert={!isOpen}>
          {projects.map(({ cubeColors, name, slug }, index) => (
            <li key={slug} style={getCubeStyle(index, cubeColors.face, cubeColors.top)}>
              <button
                aria-haspopup="dialog"
                className="project-cube-button"
                onClick={() => setSelectedSlug(slug)}
                type="button"
              >
                <span aria-hidden="true" className="project-cube">
                  <span className="project-cube-face" data-side="top" />
                  <span className="project-cube-face" data-side="front" />
                  <span className="project-cube-face" data-side="side" />
                </span>
                <span className="project-cube-label">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p aria-live="polite" className="mt-4 text-center">
        {isOpen ? 'Elige un cubo para ver el proyecto.' : 'Haz clic en el cofre para abrirlo.'}
      </p>

      <nav aria-label="Lista de proyectos" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-2">
          {projects.map(({ name, slug }) => (
            <li key={slug}>
              <button
                aria-haspopup="dialog"
                className="choice-button"
                onClick={() => setSelectedSlug(slug)}
                type="button"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <ProjectDialog onClose={() => setSelectedSlug(null)} project={selectedProject} />
    </div>
  )
}
