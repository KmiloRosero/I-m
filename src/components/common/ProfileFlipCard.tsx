'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { personalInfo } from '@/data/personalInfo'
import { getCvLinks } from '@/utils/professionalLinks'

const cvLinks = getCvLinks()

export function ProfileFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false)
  const hasInteractedRef = useRef(false)
  const showProfileRef = useRef<HTMLButtonElement>(null)
  const showPhotoRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!hasInteractedRef.current) return
    const target = isFlipped ? showPhotoRef : showProfileRef
    target.current?.focus({ preventScroll: true })
  }, [isFlipped])

  function toggleCard() {
    hasInteractedRef.current = true
    setIsFlipped((current) => !current)
  }

  return (
    <div aria-label="Tarjeta de presentación" className="flip-card" role="group">
      <div className="flip-card-inner" data-flipped={isFlipped}>
        <article className="flip-card-face" data-side="front" inert={isFlipped}>
          <div className="flip-card-photo">
            <Image
              alt={`Fotografía de ${personalInfo.name}`}
              className="object-cover object-[50%_32%]"
              fill
              preload
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 26rem, 100vw"
              src="/images/profile/camilo-rosero.png"
            />
          </div>
          <div className="flex flex-col gap-3 bg-black p-4 text-white">
            <div>
              <p className="item-title">{personalInfo.name}</p>
              <p className="mt-2 leading-snug">{personalInfo.studies}</p>
              <p className="leading-snug">{personalInfo.position}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="button-link" data-variant="primary" href="#proyectos">
                Ver proyectos
              </a>
              <button
                className="button-link"
                data-variant="secondary"
                onClick={toggleCard}
                ref={showProfileRef}
                type="button"
              >
                Ver mi perfil
              </button>
            </div>
          </div>
        </article>

        <article className="flip-card-face" data-side="back" inert={!isFlipped}>
          <p className="item-title">Hola, soy {personalInfo.firstName}</p>
          <p className="lead-text">{personalInfo.introduction}</p>
          <div>
            <p className="mb-2 font-display font-bold">Stack</p>
            <ul className="flex flex-wrap gap-1.5">
              {personalInfo.featuredStack.map((technology) => (
                <li className="stack-tag" key={technology}>
                  {technology}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              className="button-link"
              data-variant="secondary"
              onClick={toggleCard}
              ref={showPhotoRef}
              type="button"
            >
              Volver a la foto
            </button>
            {cvLinks.length > 0 ? (
              cvLinks.map((link) => <ExternalAwareLink key={link.url} {...link} />)
            ) : (
              <p>CV disponible pronto</p>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
