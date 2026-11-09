'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { ProjectDialog } from '@/components/projects/ProjectDialog'
import { useMessages } from '@/i18n/LocaleProvider'
import type { Project } from '@/types/project'
import { createBlockTexture, type BlockTexture } from '@/utils/blockTextures'

type CubeStyle = CSSProperties & Record<`--cube-${string}`, number | string>

const CUBES_ID = 'project-cubes'

function getCubeStyle(index: number, count: number, texture: BlockTexture | undefined): CubeStyle {
  const centerIndex = (count - 1) / 2
  const offset = index - centerIndex
  return {
    '--cube-arc': centerIndex - Math.abs(offset),
    '--cube-index': index,
    '--cube-offset': offset,
    '--cube-side': texture ? `url("${texture.side}")` : 'none',
    '--cube-top': texture ? `url("${texture.top}")` : 'none',
  }
}

export function ProjectChest({ projects }: { projects: readonly Project[] }) {
  const copy = useMessages().projects
  const blockTextures = useMemo(
    () => projects.map(({ block }, index) => createBlockTexture(block, index + 1)),
    [projects],
  )
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
          <span className="sr-only">{isOpen ? copy.closeChest : copy.openChest}</span>
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

        <ul aria-label={copy.cubes} className="chest-cubes" id={CUBES_ID} inert={!isOpen}>
          {projects.map(({ name, slug }, index) => (
            <li key={slug} style={getCubeStyle(index, projects.length, blockTextures[index])}>
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
        {isOpen ? copy.pickCube : copy.clickChest}
      </p>

      <nav aria-label={copy.list} className="mt-8">
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
