import type { CSSProperties, ReactNode } from 'react'

interface StorySectionProps {
  children: ReactNode
  id?: string | undefined
  innerClassName?: string
  navSectionId?: string
  style?: CSSProperties | undefined
}

export function StorySection({ children, id, innerClassName, navSectionId, style }: StorySectionProps) {
  return (
    <div className="story-track" data-nav-section={navSectionId} id={id}>
      <div className="story-section">
        <div className={`story-section-inner ${innerClassName ?? ''}`} style={style}>
          {children}
        </div>
      </div>
    </div>
  )
}
