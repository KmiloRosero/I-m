'use client'

import { useEffect, useState } from 'react'
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

function getStroke(level: number): string {
  return level >= SUMMIT_ZONE_METERS ? 'var(--color-sulfur)' : 'var(--color-bone)'
}

function getViewBox(size: number): string {
  const span = size * VIEW_SCALE
  const x = terrainMeta.peak.x * size - span * PEAK_POSITION_X
  const y = terrainMeta.peak.y * size - span * PEAK_POSITION_Y
  return `${x.toFixed(1)} ${y.toFixed(1)} ${span.toFixed(1)} ${span.toFixed(1)}`
}

export function ContourField() {
  const [data, setData] = useState<ContourData | null>(null)

  useEffect(() => {
    let isActive = true
    void import('@/assets/terrain/galeras-contours.json').then((module) => {
      if (isActive) setData(module.default)
    })
    return () => {
      isActive = false
    }
  }, [])

  return (
    <svg
      aria-hidden="true"
      className="contour-field absolute inset-0 size-full"
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
            strokeOpacity={isIndexContour ? 0.9 : 0.5}
            strokeWidth={isIndexContour ? 1.5 : 0.9}
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
    </svg>
  )
}
