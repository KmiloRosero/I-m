'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, type MouseEvent } from 'react'
import { ProjectLinks } from '@/components/projects/ProjectLinks'
import type { Project } from '@/types/project'
import { formatKinds } from '@/utils/categoryLabels'
import { getProjectMeta } from '@/utils/projectMeta'

const VISIBLE_FEATURES = 4

interface ProjectDialogProps {
  onClose: () => void
  project: Project | null
}

export function ProjectDialog({ onClose, project }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project && !dialog.open) dialog.showModal()
    if (!project && dialog.open) dialog.close()
  }, [project])

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close()
  }

  const [screenshot] = project?.screenshots ?? []

  return (
    <dialog
      aria-labelledby={project ? 'project-dialog-title' : undefined}
      className="project-dialog"
      onClick={closeOnBackdrop}
      onClose={onClose}
      ref={dialogRef}
    >
      {project ? (
        <div className="project-dialog-body">
          <div className="flex items-start justify-between gap-4">
            <p>{getProjectMeta(project)}</p>
            <button
              aria-label="Cerrar"
              className="project-dialog-close"
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <h3 className="project-dialog-title" id="project-dialog-title">
            {project.name}
          </h3>
          <p className="lead-text">{project.description}</p>

          {screenshot ? (
            <Image
              alt={screenshot.alt}
              className="project-dialog-image"
              height={screenshot.height}
              sizes="(min-width: 768px) 40rem, 90vw"
              src={screenshot.src}
              width={screenshot.width}
            />
          ) : null}

          <dl className="project-dialog-facts">
            {project.categories.length > 0 ? (
              <div>
                <dt>Tipo</dt>
                <dd>{formatKinds(project.categories)}</dd>
              </div>
            ) : null}
            {project.contribution ? (
              <div>
                <dt>Mi aporte</dt>
                <dd>{project.contribution}</dd>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <dt>Stack</dt>
              <dd>{[...project.frameworks, ...project.technologies].join(', ')}</dd>
            </div>
          </dl>

          <ul className="project-features">
            {project.verifiedFeatures.slice(0, VISIBLE_FEATURES).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.hasCaseStudy ? (
              <Link className="button-link" data-variant="primary" href={`/proyectos/${project.slug}`}>
                Ver caso de estudio
              </Link>
            ) : null}
            <ProjectLinks project={project} />
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
