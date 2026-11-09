import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { useMessages } from '@/i18n/LocaleProvider'
import type { GalleryImage, ServiceGroup, ServiceVisual as ServiceVisualData } from '@/types/service'

type StaggerStyle = CSSProperties & Record<'--stagger-index', number>

const staggerStyle = (index: number): StaggerStyle => ({ '--stagger-index': index })

function GroupList({ groups, variant }: { groups: readonly ServiceGroup[]; variant: 'routes' | 'tables' }) {
  return (
    <div className="service-board" data-variant={variant}>
      {groups.map(({ items, label }, index) => (
        <section aria-label={label} className="service-group service-pop" key={label} style={staggerStyle(index)}>
          <p className="service-group-label">{label}</p>
          <ul className="service-group-items">
            {items.map((item) => (
              <li key={item}>
                <code>{item}</code>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Gallery({ images }: { images: readonly GalleryImage[] }) {
  const messages = useMessages()
  return (
    <ul className="service-gallery">
      {images.map((image, index) => (
        <li className="service-pop" key={image.src} style={staggerStyle(index)}>
          <figure className="service-gallery-item">
            <Image
              alt={image.alt}
              height={image.height}
              sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 85vw"
              src={image.src}
              width={image.width}
            />
            <figcaption>
              <span>{image.caption}</span>
              {image.href ? (
                <a href={image.href} rel="noreferrer" target="_blank">
                  {messages.services.visitSite}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                  <span className="sr-only">
                    {messages.common.linkContext(image.caption)}
                    {messages.common.opensInNewTab}
                  </span>
                </a>
              ) : null}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

export function ServiceVisual({ visual }: { visual: ServiceVisualData }) {
  if (visual.kind === 'gallery') return <Gallery images={visual.images} />
  if (visual.kind !== 'screens') return <GroupList groups={visual.groups} variant={visual.kind} />

  return (
    <div className="service-screens" data-count={visual.images.length}>
      {visual.images.map((image, index) => (
        <figure
          className="service-frame service-pop"
          data-orientation={image.height > image.width ? 'portrait' : 'landscape'}
          data-position={index === 0 ? 'back' : 'front'}
          key={image.src}
          style={staggerStyle(index)}
        >
          <Image
            alt={image.alt}
            height={image.height}
            sizes="(min-width: 1024px) 32rem, 85vw"
            src={image.src}
            width={image.width}
          />
          <figcaption>{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
