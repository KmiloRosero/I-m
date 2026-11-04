'use client'

import { useEffect, useEffectEvent, type RefObject } from 'react'

/** Movement in px before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 6

/**
 * Lets a mouse drag a horizontal scroller, like a touch swipe does.
 * Touch and pen keep their native scrolling. `onRelease` runs after a drag
 * so the caller can snap to the nearest item.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>, onRelease?: () => void) {
  const release = useEffectEvent(() => onRelease?.())

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let startX = 0
    let startScroll = 0
    let pointerId: number | null = null
    let dragged = false

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (element.scrollWidth <= element.clientWidth) return
      pointerId = event.pointerId
      startX = event.clientX
      startScroll = element.scrollLeft
      dragged = false
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      const distance = event.clientX - startX
      if (!dragged && Math.abs(distance) < DRAG_THRESHOLD) return
      if (!dragged) {
        dragged = true
        element.setPointerCapture(event.pointerId)
        element.dataset.dragging = 'true'
      }
      element.scrollLeft = startScroll - distance
    }

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      pointerId = null
      if (!dragged) return
      delete element.dataset.dragging
      release()
    }

    // A drag must not also click the card or link it ended on.
    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return
      event.preventDefault()
      event.stopPropagation()
      dragged = false
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointercancel', onPointerUp)
    element.addEventListener('click', onClickCapture, true)
    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointercancel', onPointerUp)
      element.removeEventListener('click', onClickCapture, true)
    }
  }, [ref])
}
