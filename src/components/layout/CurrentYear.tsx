'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined
const getCurrentYear = () => new Date().getFullYear()

export function CurrentYear({ initialYear }: { initialYear: number }) {
  const year = useSyncExternalStore(subscribe, getCurrentYear, () => initialYear)

  return <span>{year}</span>
}
