'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useMessages } from '@/i18n/LocaleProvider'
import type { ProjectImage } from '@/types/project'

interface ScreenshotSwitcherProps {
  images: readonly ProjectImage[]
  sizes: string
}

export function ScreenshotSwitcher({ images, sizes }: ScreenshotSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const copy = useMessages().projects

  return (
    <div>
      <div className="screenshot-stage">
        {images.map((image, index) => {
          const isActive = index === activeIndex
          return (
            <Image
              alt={isActive ? image.alt : ''}
              data-active={isActive}
              data-orientation={image.height > image.width ? 'portrait' : 'landscape'}
              fill
              key={image.src}
              sizes={sizes}
              src={image.src}
            />
          )
        })}
      </div>
      <ul aria-label={copy.screens} className="mt-3 flex flex-wrap gap-2">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              aria-pressed={index === activeIndex}
              className="choice-button"
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              {image.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
