'use client'

import { useEffect, useRef, useState } from 'react'
import terrainMeta from '@/assets/terrain/galeras-meta.json'

interface ContourPath {
  level: number
  d: string
}

interface ContourData {
  size: number
  paths: ContourPath[]
}

const INDEX_CONTOUR_METERS = 1000
const SUMMIT_ZONE_METERS = 3600
const VIEW_SCALE = 0.72
const PEAK_POSITION_X = 0.66
const PEAK_POSITION_Y = 0.46
const LOAD_MARGIN = '400px'

function getStroke(level: number): string {
  return level >= SUMMIT_ZONE_METERS ? 'var(--color-red)' : 'currentColor'
}

function getViewBox(size: number): string {
  const span = size * VIEW_SCALE
  const x = terrainMeta.peak.x * size - span * PEAK_POSITION_X
  const y = terrainMeta.peak.y * size - span * PEAK_POSITION_Y
  return `${x.toFixed(1)} ${y.toFixed(1)} ${span.toFixed(1)} ${span.toFixed(1)}`
}

export function ContourField() {
  const [data, setData] = useState<ContourData | null>(null)
  const [hasFailed, setHasFailed] = useState(false)
  const figureRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const figure = figureRef.current
    if (!figure) return

    let isActive = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        import('@/assets/terrain/galeras-contours.json')
          .then((contourModule) => {
            if (isActive) setData(contourModule.default)
          })
          .catch(() => {
            if (isActive) setHasFailed(true)
          })
      },
      { rootMargin: LOAD_MARGIN },
    )
    observer.observe(figure)

    return () => {
      isActive = false
      observer.disconnect()
    }
  }, [])

  if (hasFailed) return null

  return (
    <figure className="mt-10" ref={figureRef}>
      <svg
        aria-hidden="true"
        className="contour-field aspect-[16/10] w-full lg:aspect-[21/9]"
        data-ready={data !== null}
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox={data ? getViewBox(data.size) : undefined}
      >
        {data?.paths.map(({ level, d }) => {
          const isIndexContour = level % INDEX_CONTOUR_METERS === 0
          return (
            <path
              key={level}
              d={d}
              stroke={getStroke(level)}
              strokeOpacity={isIndexContour ? 1 : 0.6}
              strokeWidth={isIndexContour ? 2 : 1}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
      <figcaption className="mt-3 text-base">
        El volcán Galeras, junto a Pasto: curvas de nivel reales, cada 200 metros. Datos de
        elevación: {terrainMeta.source}.
      </figcaption>
    </figure>
  )
}
