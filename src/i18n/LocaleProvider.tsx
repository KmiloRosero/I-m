'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

const LocaleContext = createContext<Locale>('es')

/** Makes the page's language available to client components. */
export function LocaleProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useMessages() {
  return getMessages(useLocale())
}
